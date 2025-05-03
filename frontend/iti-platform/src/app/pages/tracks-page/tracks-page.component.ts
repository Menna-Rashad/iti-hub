import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackService } from '../../services/track.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
// @ts-ignore
import AOS from 'aos';

@Component({
  selector: 'app-tracks-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracks-page.component.html',
  styleUrls: ['./tracks-page.component.css']
})
export class TracksPageComponent implements OnInit, OnDestroy {
  tracks: any[] = [];
  filteredTracks: any[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | null = null;

  

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    AOS.init();
    // جلب كل الـ tracks
    this.trackService.getAllTracks().subscribe({
      next: (res) => {
        this.tracks = res;
        this.filteredTracks = res;
      },
      error: (err) => console.error('Error fetching tracks', err)
    });

    // إعداد الـ debounce للبحث
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (!term.trim()) {
            return [this.tracks]; // إرجاع كل الـ tracks لو الـ input فاضي
          }
          return this.trackService.searchTracksByName(term);
        })
      )
      .subscribe({
        next: (res) => {
          this.filteredTracks = res || this.tracks; // إرجاع الـ tracks الأصلية لو النتيجة فاضية
        },
        error: (err) => {
          console.warn('Search error:', err); // لسه بنطبع الـ error للـ debugging
          this.filteredTracks = this.tracks; // إرجاع الـ tracks الأصلية في حالة الـ error
        }
      });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
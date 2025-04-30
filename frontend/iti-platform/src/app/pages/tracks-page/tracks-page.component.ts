import { Component, OnInit } from '@angular/core';
import { TracksService, Track } from '../../services/tracks.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

interface GroupedTracks {
  groupTitle: string;
  subGroups: {
    subGroupTitle: string;
    tracks: Track[];
  }[];
}

@Component({
  standalone: true,
  selector: 'app-tracks-page',
  templateUrl: './tracks-page.component.html',
  styleUrls: ['./tracks-page.component.css'],
  imports: [NgFor, NgIf, RouterModule]  // ← هنا المهم!
})
export class TracksPageComponent implements OnInit {
  groupedTracks: GroupedTracks[] = [];

  constructor(private tracksService: TracksService) {}

  ngOnInit(): void {
    this.tracksService.getAllTracks().subscribe(tracks => {
      const grouped = new Map<string, Map<string, Track[]>>();

      for (const track of tracks) {
        if (!grouped.has(track.group_title)) {
          grouped.set(track.group_title, new Map());
        }

        const subGroupMap = grouped.get(track.group_title)!;

        if (!subGroupMap.has(track.subgroup_title)) {
          subGroupMap.set(track.subgroup_title, []);
        }

        subGroupMap.get(track.subgroup_title)!.push(track);
      }

      this.groupedTracks = Array.from(grouped.entries()).map(([groupTitle, subGroupMap]) => ({
        groupTitle,
        subGroups: Array.from(subGroupMap.entries()).map(([subGroupTitle, tracks]) => ({
          subGroupTitle,
          tracks
        }))
      }));
    });
  }
}

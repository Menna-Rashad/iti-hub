import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {
  private baseUrl = 'http://127.0.0.1:8000/api'; 

  constructor() {
    axios.defaults.withCredentials = true; 
  }

  async getTickets(status?: string) {
    let url = `${this.baseUrl}/support-tickets`;
    if (status) url += `?status=${status}`;
    const response = await axios.get(url);
    return response.data;
  }

  async getTicket(id: number) {
    const response = await axios.get(`${this.baseUrl}/support-tickets/${id}`);
    return response.data;
  }

  async createTicket(data: any) {
    const response = await axios.post(`${this.baseUrl}/support-tickets`, data);
    return response.data;
  }

  async addReply(ticketId: number, formData: FormData) {
    const response = await axios.post(`${this.baseUrl}/support-tickets/${ticketId}/replies`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async updateTicketStatus(id: number, status: string) {
    const response = await axios.put(`${this.baseUrl}/support-tickets/${id}/status`, { status });
    return response.data;
  }

  async deleteTicket(id: number) {
    const response = await axios.delete(`${this.baseUrl}/support-tickets/${id}`);
    return response.data;
  }

  async deleteReply(id: number) {
    const response = await axios.delete(`${this.baseUrl}/support-ticket-replies/${id}`);
    return response.data;
  }
}

export interface Studio {
  id: string;
  name: string;
  addedBy: string;
  rating: number;
  services: Service[];
  status: 'approved' | 'pending';
  initials: string;
}

export interface Service {
  name: string;
  color: 'green' | 'yellow' | 'blue' | 'mint' | 'purple' | 'orange';
}
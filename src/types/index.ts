export interface Musician {
  id: string;
  name: string;
  instrument: 'Baixo' | 'Bateria' | 'Guitarra' | 'Violão' | 'Teclado' | 'Vocal' | 'Técnico de Som';
  photoUrl?: string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  lyrics?: string;
  key?: string;
  tempo?: number;
  tags?: string[];
}

export interface Vocal {
  id: string;
  name: string;
  songId: string;
}

export interface WeekSchedule {
  id: string;
  weekNumber: number;
  date: string;
  // Ex.: "Culto Manhã", "Culto Noite", "Terça de Louvor" etc.
  serviceName?: string;
  musicians: Musician[];
  vocals: Vocal[];
  offertorySong?: Song;
  offertoryMusic?: Song;
}

export interface MonthSchedule {
  id: string;
  month: number;
  year: number;
  weeks: WeekSchedule[];
}

export interface RepertoireSong {
  id: string;
  songIds: string[]; // Array para suportar medleys
  songs: Song[]; // As músicas completas
  customKey?: string; // Tom customizado para este repertório
  isMedley: boolean; // Se é um medley ou música única
  medleyTitle?: string; // Título do medley (ex: "Quão grande é o meu Deus + Somos um + Teu filho")
  moment?: string; // Momento da música (Ofertório, Apelo, etc.)
  isInstrumental?: boolean; // Se é apenas instrumental
}

export interface Repertoire {
  id: string;
  title: string;
  weekDate: string;
  musicians: Musician[];
  vocals: Vocal[];
  songs: RepertoireSong[];
  playlistUrl?: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  type: 'rehearsal' | 'service' | 'event' | 'meeting';
}

export interface Activity {
  id: string;
  type: 'musician' | 'song' | 'schedule' | 'repertoire' | 'agenda';
  action: 'added' | 'updated' | 'deleted';
  description: string;
  timestamp: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'leader';
  createdAt: Date;
}

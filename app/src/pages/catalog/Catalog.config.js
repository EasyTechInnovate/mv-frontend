// catalog.config.js - Mock data for the catalog component

export const catalogStats = {
  totalReleases: 24,
  liveReleases: 18,
  totalStreams: "2.4M",
  totalRevenue: "₹48K"
};

export const yourReleases = [
  {
    id: "REL001",
    name: "Bollywood Hits 2024",
    artist: "Various Artists",
    status: "Published",
    requestStatus: "Published",
    tracks: 12,
    releaseDate: "1/15/2024",
    coverArt: null,
    audioFile: null,
    releaseInfo: {
      releaseName: "Bollywood Hits 2024",
      genre: "Indian Bollywood",
      upc: "123456789012",
      labelName: "Bollywood Records"
    },
    trackInfo: {
      songName: "Main Title Song",
      genre: "Indian Bollywood",
      singerName: "Arijit Singh",
      composerName: "A.R. Rahman",
      lyricsName: "Gulzar",
      producerName: "Yash Raj Films",
      isrc: "INXXX2400001",
      previousRelease: "No",
      trackOption: "New Release"
    },
    stores: "All Major Platforms"
  },
  {
    id: "REL002",
    name: "Classical Ragas",
    artist: "Pandit Ravi Shankar",
    status: "Under Review",
    requestStatus: "Under Review",
    tracks: 8,
    releaseDate: "1/10/2024",
    coverArt: null,
    audioFile: null,
    releaseInfo: {
      releaseName: "Classical Ragas",
      genre: "Classical",
      upc: "123456789013",
      labelName: "Classical Music India"
    },
    trackInfo: {
      songName: "Raga Yaman",
      genre: "Classical",
      singerName: "Pandit Ravi Shankar",
      composerName: "Traditional",
      lyricsName: "Traditional",
      producerName: "Classical Records",
      isrc: "INXXX2400002",
      previousRelease: "No",
      trackOption: "New Release"
    },
    stores: "Selected Platforms"
  },
  {
    id: "REL003",
    name: "Modern Folk",
    artist: "Rajesh Kumar",
    status: "Draft",
    requestStatus: "Draft",
    tracks: 6,
    releaseDate: "1/5/2024",
    coverArt: null,
    audioFile: null,
    releaseInfo: {
      releaseName: "Modern Folk",
      genre: "Folk",
      upc: "123456789014",
      labelName: "Folk Music Co."
    },
    trackInfo: {
      songName: "Village Dreams",
      genre: "Folk",
      singerName: "Rajesh Kumar",
      composerName: "Rajesh Kumar",
      lyricsName: "Rajesh Kumar",
      producerName: "Independent",
      isrc: "INXXX2400003",
      previousRelease: "No",
      trackOption: "New Release"
    },
    stores: "Major Platforms"
  },
  {
    id: "REL004",
    name: "Midnight Dreams",
    artist: "Luna Artist",
    status: "Live",
    requestStatus: "Live",
    tracks: 10,
    releaseDate: "1/15/2024",
    coverArt: null,
    audioFile: null,
    releaseInfo: {
      releaseName: "Midnight Dreams",
      genre: "Pop",
      upc: "123456789015",
      labelName: "Dream Records"
    },
    trackInfo: {
      songName: "Midnight Song",
      genre: "Pop",
      singerName: "Luna Artist",
      composerName: "Luna Artist",
      lyricsName: "Luna Artist",
      producerName: "Dream Productions",
      isrc: "INXXX2400004",
      previousRelease: "No",
      trackOption: "New Release"
    },
    stores: "All Platforms"
  },
  {
    id: "REL005",
    name: "Summer Vibes",
    artist: "Beach Boys Collective",
    status: "Processing",
    requestStatus: "Processing",
    tracks: 8,
    releaseDate: "1/10/2024",
    coverArt: null,
    audioFile: null,
    releaseInfo: {
      releaseName: "Summer Vibes",
      genre: "Pop",
      upc: "123456789016",
      labelName: "Summer Records"
    },
    trackInfo: {
      songName: "Summer Nights",
      genre: "Pop",
      singerName: "Beach Boys Collective",
      composerName: "Various",
      lyricsName: "Various",
      producerName: "Summer Productions",
      isrc: "INXXX2400005",
      previousRelease: "No",
      trackOption: "New Release"
    },
    stores: "Selected Platforms"
  },
  {
    id: "REL006",
    name: "Urban Beats",
    artist: "City Rapper",
    status: "Under Review",
    requestStatus: "Under Review",
    tracks: 12,
    releaseDate: "1/5/2024",
    coverArt: null,
    audioFile: null,
    releaseInfo: {
      releaseName: "Urban Beats",
      genre: "Hip-Hop/Rap",
      upc: "123456789017",
      labelName: "Urban Music"
    },
    trackInfo: {
      songName: "City Life",
      genre: "Hip-Hop/Rap",
      singerName: "City Rapper",
      composerName: "City Rapper",
      lyricsName: "City Rapper",
      producerName: "Urban Productions",
      isrc: "INXXX2400006",
      previousRelease: "No",
      trackOption: "New Release"
    },
    stores: "All Platforms"
  },
  {
    id: "REL007",
    name: "Classical Symphony",
    artist: "Orchestra Master",
    status: "Live",
    requestStatus: "Live",
    tracks: 15,
    releaseDate: "12/20/2023",
    coverArt: null,
    audioFile: null,
    releaseInfo: {
      releaseName: "Classical Symphony",
      genre: "Classical",
      upc: "123456789018",
      labelName: "Symphony Records"
    },
    trackInfo: {
      songName: "Symphony No. 1",
      genre: "Classical",
      singerName: "Orchestra Master",
      composerName: "Orchestra Master",
      lyricsName: "Instrumental",
      producerName: "Classical Productions",
      isrc: "INXXX2400007",
      previousRelease: "No",
      trackOption: "New Release"
    },
    stores: "Classical Platforms"
  }
];

export const draftReleases = yourReleases.filter(release => 
  release.status === "Draft" || release.status === "Under Review" || release.status === "Processing"
);

export const publishedReleases = yourReleases.filter(release => 
  release.status === "Published" || release.status === "Live"
);
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AudioUploadSection({ theme, tracks = [] }) {
  const isDark = theme === "dark";

  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const [audioInfo, setAudioInfo] = useState({
    songName: "",
    genre: "",
    singerName: "",
    composerName: "",
    lyricistName: "",
    producerName: "",
    isrc: "",
    previewStartTiming: "",
  });


  const EMusicGenre = {
    BOLLYWOOD: 'bollywood',
    CLASSICAL: 'classical',
    DEVOTIONAL: 'devotional',
    FOLK: 'folk',
    GHAZAL: 'ghazal',
    HINDI_POP: 'hindi_pop',
    INSTRUMENTAL: 'instrumental',
    PUNJABI: 'punjabi',
    REGIONAL: 'regional',
    ROCK: 'rock',
    ROMANTIC: 'romantic',
    SAD: 'sad',
    SUFI: 'sufi',
    WESTERN: 'western',
    ELECTRONIC: 'electronic',
    JAZZ: 'jazz',
    BLUES: 'blues',
    COUNTRY: 'country',
    RAP_HIP_HOP: 'rap_hip_hop',
    METAL: 'metal',
    ALTERNATIVE: 'alternative',
    INDIE: 'indie',
    WORLD_MUSIC: 'world_music',
    POP: 'pop',
    R_AND_B: 'r_and_b',
    SOUL: 'soul',
    FUNK: 'funk',
    DISCO: 'disco',
    HOUSE: 'house',
    TECHNO: 'techno',
    TRANCE: 'trance',
    DRUM_AND_BASS: 'drum_and_bass',
    DUBSTEP: 'dubstep',
    AMBIENT: 'ambient',
    EDM: 'edm',
    REGGAE: 'reggae',
    DANCEHALL: 'dancehall',
    SKA: 'ska',
    LATIN: 'latin',
    SALSA: 'salsa',
    BACHATA: 'bachata',
    REGGAETON: 'reggaeton',
    AFROBEATS: 'afrobeats',
    GOSPEL: 'gospel',
    SPIRITUAL: 'spiritual',
    BHAJAN: 'bhajan',
    KIRTAN: 'kirtan',
    QAWWALI: 'qawwali',
    CARNATIC: 'carnatic',
    HINDUSTANI: 'hindustani',
    TAMIL: 'tamil',
    TELUGU: 'telugu',
    BENGALI: 'bengali',
    MARATHI: 'marathi',
    GUJARATI: 'gujarati',
    KANNADA: 'kannada',
    MALAYALAM: 'malayalam',
    HARYANVI: 'haryanvi',
    RAJASTHANI: 'rajasthani',
    BHOJPURI: 'bhojpuri',
    SOUNDTRACK: 'soundtrack',
    SCORE: 'score',
    CHILDRENS_MUSIC: 'childrens_music',
    COMEDY: 'comedy',
    SPOKEN_WORD: 'spoken_word',
    PODCAST: 'podcast',
    AUDIOBOOK: 'audiobook',
    LOFI: 'lofi',
    TRAP: 'trap',
    DRILL: 'drill',
    GRIME: 'grime',
    K_POP: 'k_pop',
    J_POP: 'j_pop',
    OTHER: 'other'
  };
  useEffect(() => {
    if (!tracks || tracks.length === 0) return;

    const firstTrack = tracks[0];

    setAudioInfo({
      songName: firstTrack.songName || "",
      genre: firstTrack.genre || "",
      singerName: firstTrack.singerName || "",
      composerName: firstTrack.composerName || "",
      lyricistName: firstTrack.lyricistName || "",
      producerName: firstTrack.producerName || "",
      isrc: firstTrack.isrc || "",
      previewStartTiming: firstTrack.previewStartTiming || "",
    });

    if (firstTrack.audioUrl) {
      setAudioUrl(firstTrack.audioUrl);
    }
  }, [tracks]);

  console.log("Tracks received:", tracks);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setAudioFile(f);
    setAudioUrl(null);

  };


  const handleInfoChange = (key, value) => {
    setAudioInfo((prev) => {
      const next = { ...prev, [key]: value };

      return next;
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        <div
          className={`rounded-lg p-4 ${isDark
            ? "bg-[#151F28] border border-gray-700"
            : "bg-white border border-gray-200"
            }`}
        >
          <p
            className={`font-medium mb-3 ${isDark ? "text-gray-200" : "text-gray-800"
              }`}
          >
            Audio File
          </p>

          <div
            className={`rounded-lg p-6 flex flex-col items-center justify-center text-center border-2 border-dashed h-64 ${isDark ? "border-gray-700" : "border-gray-200"
              }`}
          >
            {audioFile || audioUrl ? (
              <>
                <audio
                  controls
                  src={audioFile ? URL.createObjectURL(audioFile) : audioUrl}
                  className="w-full"
                />

                <div className="w-full flex items-center justify-between mt-3">
                  <div className="text-sm truncate max-w-[65%]">
                    <span
                      className={`${isDark ? "text-gray-200" : "text-gray-800"
                        } font-medium`}
                    >
                      {audioFile ? audioFile.name : "Audio File"}
                    </span>

                    <div
                      className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      {audioFile
                        ? `${Math.round(audioFile.size / 1024)} KB`
                        : "Existing audio"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">

                    {(audioFile || audioUrl) && (
                      <a
                        href={audioFile ? URL.createObjectURL(audioFile) : audioUrl}
                        download
                      >
                        <Button className="px-4 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white">
                          Download
                        </Button>
                      </a>
                    )}


                    <button
                      onClick={() => {
                        setAudioFile(null);
                        setAudioUrl(null);

                      }}
                      className="text-xs text-gray-400 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`w-20 h-20 rounded-md flex items-center justify-center mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"
                    }`}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <path
                      d="M9 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M9 14V5l10-2v9"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}>
                  Upload Audio File
                </p>
                <p className="text-xs mb-3 text-gray-500">Accepted: MP3, WAV</p>

                <label
                  className={`inline-flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer ${isDark
                    ? "bg-transparent border border-gray-700 text-gray-200"
                    : "bg-white border border-gray-200 text-gray-800"
                    }`}
                >
                  <input
                    type="file"
                    accept="audio/mpeg, audio/wav, audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-sm">Upload</span>
                </label>
              </>
            )}
          </div>
        </div>


        <div
          className={`md:col-span-2 rounded-lg p-6 ${isDark
            ? "bg-[#151F28] border border-gray-700"
            : "bg-white border border-gray-200"
            }`}
        >
          <p
            className={`font-medium mb-4 ${isDark ? "text-gray-200" : "text-gray-800"
              }`}
          >
            Audio Information
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


            <div>
              <label className="text-xs mb-2 block text-gray-400">Song Name</label>
              <Input
                value={audioInfo.songName}
                onChange={(e) => handleInfoChange("songName", e.target.value)}
                placeholder="Enter song name"
                className={isDark ? "bg-[#0f1724] border border-gray-700 text-gray-200" : ""}
              />
            </div>
            <div>
              <label className="text-xs mb-2 block text-gray-400">Genre</label>

              <Select
                value={audioInfo.genre}
                onValueChange={(v) => handleInfoChange("genre", v)}
              >
                <SelectTrigger
                  className={isDark ? "bg-[#0f1724] border border-gray-700 text-gray-200" : ""}
                >
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>

                <SelectContent
                  className={`
    ${isDark ? "bg-[#111A22] text-gray-200" : ""}
    max-h-60 overflow-y-auto
  `}
                >

                  {Object.values(EMusicGenre).map(g => (
                    <SelectItem key={g} value={g}>
                      {g.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs mb-2 block text-gray-400">Singer Name</label>
              <Input
                value={audioInfo.singerName}
                onChange={(e) => handleInfoChange("singerName", e.target.value)}
                placeholder="Enter singer name"
                className={isDark ? "bg-[#0f1724] border border-gray-700 text-gray-200" : ""}
              />
            </div>

            <div>
              <label className="text-xs mb-2 block text-gray-400">Composer Name</label>
              <Input
                value={audioInfo.composerName}
                onChange={(e) => handleInfoChange("composerName", e.target.value)}
                placeholder="Enter composer name"
                className={isDark ? "bg-[#0f1724] border border-gray-700 text-gray-200" : ""}
              />
            </div>

            <div>
              <label className="text-xs mb-2 block text-gray-400">Lyricist Name</label>
              <Input
                value={audioInfo.lyricistName}
                onChange={(e) => handleInfoChange("lyricistName", e.target.value)}
                placeholder="Enter lyricist name"
                className={isDark ? "bg-[#0f1724] border border-gray-700 text-gray-200" : ""}
              />
            </div>

            <div>
              <label className="text-xs mb-2 block text-gray-400">Producer Name</label>
              <Input
                value={audioInfo.producerName}
                onChange={(e) => handleInfoChange("producerName", e.target.value)}
                placeholder="Enter producer name"
                className={isDark ? "bg-[#0f1724] border border-gray-700 text-gray-200" : ""}
              />
            </div>

            <div>
              <label className="text-xs mb-2 block text-gray-400">ISRC</label>
              <Input
                value={audioInfo.isrc}
                onChange={(e) => handleInfoChange("isrc", e.target.value)}
                placeholder="Enter ISRC"
                className={isDark ? "bg-[#0f1724] border border-gray-700 text-gray-200" : ""}
              />
            </div>

            <div>
              <label className="text-xs mb-2 block text-gray-400">
                Preview Timing (HH:MM:SS)
              </label>
              <Input
                value={audioInfo.previewStartTiming}
                onChange={(e) => handleInfoChange("previewStartTiming", e.target.value)}
                placeholder="00:00:00"
                className={isDark ? "bg-[#0f1724] border border-gray-700 text-gray-200" : ""}
              />
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

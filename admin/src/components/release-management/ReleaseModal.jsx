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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import AudioUploadSection from "./ReleaseModalAudio";
import GlobalApi from "@/lib/GlobalApi";
import StepThreeReview from "./ReleaseModalDeliveryDetails";

function SkeletonBox({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-300/30 dark:bg-gray-700/30 ${className}`}
    />
  );
}

export default function ReleaseModal({ theme, defaultData, userId, onBack }) {
  const isDark = theme === "dark";


  const releaseId = defaultData;

  const [loading, setLoading] = useState(true);

  const [coverArt, setCoverArt] = useState(null);

  const [releaseData, setReleaseData] = useState({
    releaseName: "",
    genre: "",
    labelName: "",
    upc: "",
    status: "",
  });

  const [trackData, setTrackData] = useState([]);

  const handleChange = (key, value) =>
    setReleaseData((prev) => ({ ...prev, [key]: value }));

  const handleCoverArtUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setCoverArt(file);
  };

  useEffect(() => {
    if (!releaseId) return;

    const fetchDetails = async () => {
      try {
        const res = await GlobalApi.getReleaseDetails(releaseId);
        const data = res.data?.data;

        if (!data) return;


        const info = data.step1?.releaseInfo || {};

        setReleaseData({
          releaseName: info.releaseName || "",
          genre: info.genre || "",
          labelName: info.labelName || "",
          upc: info.upc || "",
          status: data.releaseStatus || "",
        });


        if (data.step1?.coverArt?.imageUrl) {
          setCoverArt(data.step1.coverArt.imageUrl);
        }

        if (data.step2?.tracks) {
          setTrackData(data.step2.tracks);
        }

      } catch (err) {
        console.error("Error fetching release details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [releaseId]);

  if (loading) {
    return (
      <div
        className={`p-6 space-y-6 ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
          }`}
      >
        <SkeletonBox className="h-8 w-48" />
        <SkeletonBox className="h-6 w-64" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonBox className="h-64 w-full" />
          <SkeletonBox className="h-64 w-full md:col-span-2" />
        </div>

        <SkeletonBox className="h-56 w-full" />
      </div>
    );
  }

  return (
    <div
      className={`p-6 space-y-6 transition-colors duration-200 ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"
        }`}
    >

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className={`px-4 py-2 rounded-md ${isDark
              ? "bg-[#151F28] border border-gray-700 text-gray-200 hover:bg-[#1d2631]"
              : "bg-white border border-gray-200 text-gray-800 hover:bg-gray-100"
              }`}
          >
            ← Back
          </Button>

          <div>
            <h1 className="text-2xl font-semibold">Release Management</h1>
            <p
              className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
            >
              Manage music releases and track distribution across platforms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${isDark
                  ? "bg-[#151F28] border border-gray-700 text-gray-200"
                  : "bg-white border border-gray-200 text-gray-800"
                  }`}
              >
                <Download className="w-4 h-4" /> Export CSV/Excel
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className={`w-56 ${isDark
                ? "bg-gray-800 border border-gray-700 text-gray-200"
                : "bg-white border border-gray-200 text-gray-800"
                } rounded-md shadow-md`}
            >
              <DropdownMenuItem>Export Cover Art</DropdownMenuItem>
              <DropdownMenuItem>Export Audio File</DropdownMenuItem>
              <DropdownMenuItem>Export Whole File</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          <Select
            value={releaseData.status}
            onValueChange={(v) => handleChange("status", v)}
          >
            <SelectTrigger
              className={`w-44 rounded-full px-4 py-2 text-sm border-2 border-purple-600 ${isDark ? "bg-[#151F28] text-gray-200" : "bg-white text-gray-800"
                }`}
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent
              className={isDark ? "bg-gray-800 text-gray-200" : "bg-white"}
            >
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        <div
          className={`relative rounded-lg p-4 ${isDark
            ? "bg-[#151F28] border border-gray-700"
            : "bg-white border border-gray-200"
            }`}
        >
          <p className="font-medium mb-3">Cover Art</p>

          <div
            className={`relative rounded-lg border-2 border-dashed h-64 flex items-center justify-center overflow-hidden ${isDark
              ? "border-gray-700 bg-transparent"
              : "border-gray-200 bg-white"
              }`}
          >
            {coverArt ? (
              <>
                <img
                  src={
                    typeof coverArt === "string"
                      ? coverArt
                      : URL.createObjectURL(coverArt)
                  }
                  className="h-full w-full object-contain"
                />


                <a
                  href={
                    typeof coverArt === "string"
                      ? coverArt
                      : URL.createObjectURL(coverArt)
                  }
                  download={
                    typeof coverArt === "string" ? "cover-art.jpg" : coverArt.name
                  }
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
                >
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium ${isDark ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-purple-500 text-white hover:bg-purple-600"
                      }`}
                  >
                    Download Cover Art
                  </button>
                </a>
              </>
            ) : (
              <p>No Image</p>
            )}
          </div>
        </div>





        <div
          className={`md:col-span-2 rounded-lg p-6 ${isDark
            ? "bg-[#151F28] border border-gray-700"
            : "bg-white border border-gray-200"
            }`}
        >
          <p className="font-medium mb-4">Track Information</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="md:col-span-2">
              <label className="text-xs mb-2 block">Release Name</label>
              <Input
                value={releaseData.releaseName}
                onChange={(e) =>
                  handleChange("releaseName", e.target.value)
                }
                className={`w-full rounded-md ${isDark
                  ? "bg-[#0f1724] border border-gray-700 text-gray-200"
                  : "bg-white border border-gray-200 text-[#111A22]"
                  }`}
              />
            </div>


            <div>
              <label className="text-xs mb-2 block">Genre</label>

              <Select
                value={releaseData.genre}
                onValueChange={(v) => handleChange("genre", v)}
              >
                <SelectTrigger
                  className={`w-full rounded-md ${isDark
                    ? "bg-[#0f1724] border border-gray-700 text-gray-200"
                    : "bg-white border border-gray-200 text-[#111A22]"
                    }`}
                >
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>

                <SelectContent
                  className={isDark ? "bg-gray-800" : "bg-white"}
                >
                  <SelectItem value="bollywood">Bollywood</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip hop">Hip Hop</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="md:col-span-3">
              <label className="text-xs mb-2 block">Label Name</label>
              <Input
                value={releaseData.labelName}
                onChange={(e) =>
                  handleChange("labelName", e.target.value)
                }
                className={`w-full rounded-md ${isDark
                  ? "bg-[#0f1724] border border-gray-700 text-gray-200"
                  : "bg-white border border-gray-200 text-[#111A22]"
                  }`}
              />
            </div>


            <div className="md:col-span-3">
              <label className="text-xs mb-2 block">UPC</label>
              <Input
                value={releaseData.upc}
                onChange={(e) => handleChange("upc", e.target.value)}
                className={`w-full rounded-md ${isDark
                  ? "bg-[#0f1724] border border-gray-700 text-gray-200"
                  : "bg-white border border-gray-200 text-[#111A22]"
                  }`}
              />
            </div>
          </div>
        </div>
      </div>



      {console.log("TRACK DATA IN PARENT:", trackData)}
      <AudioUploadSection
        theme={theme}
        tracks={trackData.map((t) => ({
          songName: t.trackName || "",
          genre: t.genre || "",
          singerName: t.singerName || "",
          composerName: t.composerName || "",
          lyricistName: t.lyricistName || "",
          producerName: t.producerName || "",
          isrc: t.isrc || "",
          previewTiming: t.previewTiming
            ? `${t.previewTiming.startTime}-${t.previewTiming.endTime}`
            : "",
          callerTuneTiming: t.callerTuneTiming
            ? `${t.callerTuneTiming.startTime}-${t.callerTuneTiming.endTime}`
            : "",
          audioUrl: t.audioFiles?.[0]?.fileUrl || ""
        }))}
      />



      <StepThreeReview theme={theme} />
    </div>
  );
}

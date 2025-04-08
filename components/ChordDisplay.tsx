"use client";
import React from "react";

interface ChordDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  songData: {
    title: string;
    artist: string;
    lyrics: Array<
      Array<{
        lyrics: string;
        chords?: string;
      }>
    >;
  };
}

const ChordDisplay = ({ isOpen, onClose, songData }: ChordDisplayProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{songData.title}</h2>
            <p className="text-gray-600">{songData.artist}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Song Content */}
        <div className="font-mono">
          {songData.lyrics.map((line, lineIndex) => (
            <div key={lineIndex} className="mb-4">
              {/* Chords Line */}
              <div className="text-blue-600 h-6">
                {line.map((item, itemIndex) => (
                  <span
                    key={`chord-${itemIndex}`}
                    className="inline-block"
                    style={{
                      minWidth: `${item.lyrics.length}ch`,
                      marginRight: "1ch",
                    }}
                  >
                    {item.chords || ""}
                  </span>
                ))}
              </div>
              {/* Lyrics Line */}
              <div>
                {line.map((item, itemIndex) => (
                  <span
                    key={`lyric-${itemIndex}`}
                    className="inline-block"
                    style={{ marginRight: "1ch" }}
                  >
                    {item.lyrics}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChordDisplay;

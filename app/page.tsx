"use client";
import React, { useState } from "react";
import { PlusCircle, ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Memory {
  id: number;
  title: string;
  content: string;
}

interface Lane {
  id: number;
  title: string;
  memories: Memory[];
}

const MemoryLaneRoadUI: React.FC = () => {
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [newLaneTitle, setNewLaneTitle] = useState("");
  const [visibleLanes, setVisibleLanes] = useState<Lane[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedLane, setSelectedLane] = useState<Lane | null>(null);
  const [newMemory, setNewMemory] = useState<{
    title: string;
    content: string;
  }>({ title: "", content: "" });

  const createLane = () => {
    if (newLaneTitle.trim() !== "") {
      const newLane = { id: Date.now(), title: newLaneTitle, memories: [] };
      setLanes([...lanes, newLane]);
      setNewLaneTitle("");
      updateVisibleLanes([...lanes, newLane]);
    }
  };

  const updateVisibleLanes = (allLanes: Lane[]) => {
    setVisibleLanes(allLanes.slice(startIndex, startIndex + 3));
  };

  const slideLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
      updateVisibleLanes(lanes);
    }
  };

  const slideRight = () => {
    if (startIndex + 3 < lanes.length) {
      setStartIndex(startIndex + 1);
      updateVisibleLanes(lanes);
    }
  };

  const addMemory = () => {
    if (selectedLane && newMemory.title && newMemory.content) {
      const updatedLanes = lanes.map((lane) =>
        lane.id === selectedLane.id
          ? {
              ...lane,
              memories: [...lane.memories, { ...newMemory, id: Date.now() }],
            }
          : lane
      );
      setLanes(updatedLanes);
      updateVisibleLanes(updatedLanes);
      setNewMemory({ title: "", content: "" });
    }
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{ background: "linear-gradient(to bottom, #87CEEB, #E0F6FF)" }}
    >
      <div className="flex-grow flex flex-col justify-center items-center relative">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex items-center">
          <Input
            type="text"
            placeholder="New Lane Title"
            value={newLaneTitle}
            onChange={(e) => setNewLaneTitle(e.target.value)}
            className="mr-2"
          />
          <Button onClick={createLane}>
            <PlusCircle className="mr-2" /> Add Lane
          </Button>
        </div>

        <div className="flex justify-center items-center w-full">
          <Button
            variant="ghost"
            onClick={slideLeft}
            disabled={startIndex === 0}
          >
            <ChevronLeft size={24} />
          </Button>

          <div className="flex justify-center items-center">
            {visibleLanes.map((lane, index) => (
              <Dialog key={lane.id}>
                <DialogTrigger asChild>
                  <div
                    className="bg-green-600 text-white p-4 m-2 rounded shadow-md flex justify-center items-center cursor-pointer"
                    style={{
                      width: "200px",
                      height: "100px",
                      border: "4px solid white",
                      transform: `translateY(${index * 20}px)`,
                    }}
                    onClick={() => setSelectedLane(lane)}
                  >
                    <span className="text-center font-bold">{lane.title}</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{lane.title} Memories</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <Input
                      type="text"
                      placeholder="Memory Title"
                      value={newMemory.title}
                      onChange={(e) =>
                        setNewMemory({ ...newMemory, title: e.target.value })
                      }
                      className="mb-2"
                    />
                    <Textarea
                      placeholder="Memory Content"
                      value={newMemory.content}
                      onChange={(e) =>
                        setNewMemory({ ...newMemory, content: e.target.value })
                      }
                      className="mb-2"
                    />
                    <Button onClick={addMemory}>
                      <PlusCircle className="mr-2" /> Add Memory
                    </Button>
                  </div>
                  <div className="mt-4 max-h-60 overflow-y-auto">
                    {lane.memories.map((memory) => (
                      <div
                        key={memory.id}
                        className="bg-white p-2 mb-2 rounded"
                      >
                        <h3 className="font-bold">{memory.title}</h3>
                        <p>{memory.content}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={slideRight}
            disabled={startIndex + 3 >= lanes.length}
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>

      <div className="h-1/3 bg-gray-400 relative overflow-hidden">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-full h-16 flex justify-center items-center">
            <div className="w-1/5 h-4 bg-white mx-2"></div>
            <div className="w-1/5 h-4 bg-white mx-2"></div>
            <div className="w-1/5 h-4 bg-white mx-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryLaneRoadUI;

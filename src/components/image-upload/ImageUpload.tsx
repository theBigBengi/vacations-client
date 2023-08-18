import React, { useState, ChangeEvent, useRef, DragEvent } from "react";

interface ImageDropDivProps {
  setMedia: (file: File | null) => void;
  preview?: string | undefined;
}

const ImageUpload: React.FC<{
  setFile: (f: File) => void;
  name: string;
  preview: string | undefined;
  setPreview: (url: string | undefined) => void;
}> = ({ setFile, preview, name, setPreview }) => {
  const [highlighted, setHighlighted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(file as any);
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const dragEvent = (e: DragEvent<HTMLDivElement>, valueToSet: boolean) => {
    e.preventDefault();
    setHighlighted(valueToSet);
  };

  return (
    <div>
      <div
        id='imgInput'
        onDragOver={(e: any) => dragEvent(e, true)}
        onDragLeave={(e: any) => dragEvent(e, false)}
        onDrop={(e: any) => {
          dragEvent(e, false);

          const droppedFile: any = Array.from(e.dataTransfer.files);

          if (droppedFile?.length > 0) {
            setFile(droppedFile[0]);
            setPreview(URL.createObjectURL(droppedFile[0]));
          }
        }}
        style={{
          width: "100%",
          border: `2px dashed ${highlighted ? "green" : "lightgray"}`,
          backgroundColor: `${highlighted ? "#12c73951" : "transparent"}`,
          height: "auto",
          backgroundImage: "url('/Upload-Icon-Logo.png')",
          backgroundPosition: "center",
          backgroundSize: "50px",
          backgroundRepeat: "no-repeat",
          cursor: "pointer",
          borderRadius: 5,
          minHeight: 100,
          position: "relative",
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview && (
          <img
            crossOrigin='anonymous'
            src={preview}
            alt='Selected'
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
              border: "2px dashed gray",
            }}
          />
        )}
        {preview && (
          <button
            style={{ zIndex: 1, position: "absolute", top: 12, right: 12 }}
            onClick={(e) => {
              e.stopPropagation();
              setPreview(undefined);
            }}
          >
            erase
          </button>
        )}
      </div>
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type='file'
        accept='image/*'
        name={name}
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUpload;

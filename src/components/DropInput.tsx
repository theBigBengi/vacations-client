import React, { useRef, useState, ChangeEvent, DragEvent } from "react";

const defaultPicUrl =
  "https://res.cloudinary.com/dmvrg0zih/image/upload/v1657929565/blank-profile-picture-973460_640_mm38ev.png";

// const DropDiv = styled("div", {
//   height: 150,
//   width: 150,
//   br: 999,
//   position: "relative",
//   my: 30,
//   border: "2px solid $gray7",

//   "&:hover": { cursor: "pointer" },
// });

// const DropDivOverlay = styled("div", {
//   height: 150,
//   width: 150,
//   br: 999,
//   zIndex: 10,
//   position: "absolute",
//   top: 0,
//   right: 0,
//   border: "2px solid $green9",

//   variants: {
//     highlighted: {
//       true: {
//         backgroundColor: "$green6",
//         opacity: 0.5,
//       },
//       false: {
//         // borderColor: "$red9",
//         display: "none",
//       },
//     },
//   },
// });

interface ImageDropDivProps {
  setMedia: (file: File | null) => void;
  preview?: string | null;
}

const ImageDropDiv: React.FC<ImageDropDivProps> = ({ setMedia, preview }) => {
  const [mediaPreview, setMediaPreview] = useState<string | null>(
    preview || null
  );
  const [highlighted, setHighlighted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length > 0) {
      setMedia(files[0]);
      return setMediaPreview(URL.createObjectURL(files[0]));
    }
  };

  const dragEvent = (e: DragEvent<HTMLDivElement>, valueToSet: boolean) => {
    e.preventDefault();
    setHighlighted(valueToSet);
  };

  return (
    <>
      <input
        type='file'
        accept='image/*'
        onChange={handleChange}
        name='media'
        ref={inputRef}
      />

      {/* <DropDiv
        highlighted={highlighted}
        onDragOver={(e:any) => dragEvent(e, true)}
        onDragLeave={(e:any) => dragEvent(e, false)}
        onDrop={(e:any) => {
          dragEvent(e, false);

          const droppedFile:any = Array.from(e.dataTransfer.files);

          if (droppedFile?.length > 0) {
            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }
        }}
      > */}
      {mediaPreview && (
        <button
          style={{ position: "absolute", top: -10, right: -40 }}
          onClick={() => {
            setMedia(null);
            setMediaPreview(null);
          }}
        >
          erase
        </button>
      )}

      {/* <Image
          onClick={() => inputRef.current?.click()}
          alt='user-profile-pic'
          height={150}
          width={150}
          src={mediaPreview === null ? defaultPicUrl : mediaPreview}
          style={{ borderRadius: 999 }}
        /> */}

      {/* <DropDivOverlay highlighted={highlighted} />
      </DropDiv> */}
    </>
  );
};

export default ImageDropDiv;

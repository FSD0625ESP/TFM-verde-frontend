import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import "./DropZone.css";

export default function DropZoneWithPreviews(props) {
  const { required, name } = props;

  const hiddenInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
    acceptedFiles,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    /* onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    }, */
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
        // Note the specific way we need to munge the file into the hidden input
        // https://stackoverflow.com/a/68182158/1068446
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach((v) => {
          dataTransfer.items.add(v);
        });
        hiddenInputRef.current.files = dataTransfer.files;
      }
    },
  });

  /* const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  )); */

  const thumbs = files.map((file) => (
    <div className="thumb" key={file.name}>
      <div className="thumbInner">
        <img
          src={file.preview}
          className="img"
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  const style = useMemo(
    () => ({
      ...(isFocused ? "focusedStyle" : {}),
      ...(isDragAccept ? "acceptStyle" : {}),
      ...(isDragReject ? "rejectStyle" : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className={`dropZoneContainer ${style}`}>
      <div className="dropzone">
        {/*
          Add a hidden file input 
          Best to use opacity 0, so that the required validation message will appear on form submission
        */}
        <input
          type="file"
          name={name}
          required={required}
          style={{ opacity: 0 }}
          ref={hiddenInputRef}
        />
        <input {...getInputProps()} />
        <p>Arrastra las imagenes aqui o haz click para seleccionarlas</p>
      </div>
      <aside className="thumbsContainer">{thumbs}</aside>
    </section>
  );
}

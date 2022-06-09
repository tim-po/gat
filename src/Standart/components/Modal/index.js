import React, {useRef} from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import './index.css'

const Modal = ({children, onClose, title}) => {
  const ref = useRef(null);

  const closeModal = () => {
    document.querySelector("body").classList.remove("overflow-hidden");
    onClose();
  };

  useOnClickOutside(ref, () => {
    closeModal();
  });

  return (
    <div
      className="modal-container fixed overflow-auto flex items-center"
    >
      <div
        ref={ref}
        className="modal-content relative p-8 border-2 border-primary bg-white w-full max-w-md m-auto h-custom"
        style={{

        }}
      >
        <div className="flex flex-row items-center">
          <div className="text-3xl font-bold text-black">{title}</div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;

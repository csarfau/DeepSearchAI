import { toast, ToastOptions, Flip, ToastContentProps  } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type ToastType = "info" | "success" | "error" | "warn";

const useToast = () => {
    const defaultOptions: ToastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip
    };

    const showToast = (
        message: string,
        type: ToastType = "info",
        options?: ToastOptions
    ) => {
        const mergedOptions = {
            ...defaultOptions,
            ...options,
            style: {
                background:
                    type === "success"
                        ? "#06A678"
                        : type === "error"
                        ? "#d3352a"
                        : type === "warn"
                        ? "#AF5706"
                        : "#103F89",
                color: "#FFFFFF",
            },
        };
        
        switch (type) {
            case "success":
                toast.success(message, mergedOptions);
                break;
            case "error":
                toast.error(message, mergedOptions);
                break;
            case "warn":
                toast.warn(message, mergedOptions);
                break;
            default:
                toast.info(message, mergedOptions);
                break;
        }
    };

    return showToast;
};


export default useToast;

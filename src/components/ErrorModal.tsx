export const ErrorModal = ({
  error,
  setIsOpen,
}: {
  error: { status: number; message: string };
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const errorType = () => {
    if (error.status === 400) {
      return "Bad Request Error";
    } else if (error.status === 401) {
      return "Unauthorized Error";
    } else if (error.status === 403) {
      return "Permission Denied";
    } else if (error.status === 404) {
      return "Not Found Error";
    } else if (error.status === 500) {
      return "Internal Server Error";
    } else {
      return "Unknown Error";
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-5 flex flex-col z-20 w-96">
        <div className="text-2xl font-bold text-alert border-b border-alert">
          {errorType()}
        </div>
        <div className="text-md py-6">{error.message}</div>
        <div className="flex flex-row justify-end w-full">
          <button
            className="bg-white text-primary border border-primary w-32 h-10 font-bold"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
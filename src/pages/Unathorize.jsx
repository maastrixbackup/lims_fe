import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="card w-[28rem] bg-white shadow-xl p-8 text-center">
        <div className="text-red-500 text-7xl mb-4">⛔</div>
        <h1 className="text-3xl font-bold mb-2 text-error">Unauthorized</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page. <br />
          Please contact your administrator if you think this is a mistake.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="btn btn-outline btn-error">
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
}

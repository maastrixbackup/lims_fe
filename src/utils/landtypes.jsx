import { useParams } from "react-router-dom";

export function useLandTypeParam() {
  const { landType } = useParams();

  switch (landType?.toLowerCase()) {
    case "govt-land":
      return 2;
    case "forest-land":
      return 3;
    default:
      return 1; // private-land
  }
}

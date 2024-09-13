import Home from "@pages/Home";
import Error404 from "@pages/Error404";
import Loader from "@components/Loader";
import { getHash } from "./Tools";
import NoConfomidad from "@pages/NoConformidad/NoConformidad";
import NoConfomidades from "@pages/NoConformidad/NoConformidades";
import AddNoConfomidad from "@pages/NoConformidad/AddNoConformidad";
import AddOportunidad from "@pages/Oportunidad/AddOportunidad";

const routes = {
  "/": Home,
  "/no-conformidad=:id": NoConfomidad,
  "/no-conformidades": NoConfomidades,
  "/add-no-confomidad": AddNoConfomidad,
  "/add-oportunidad": AddOportunidad,
};
const resolveRoutes = (route) => {
  if (route === undefined) {
    route = "";
  }
  else if(route.startsWith('no-conformidad=')) {
    route = "no-conformidad=:id"
  }
  return `/${route}`;
};

const router = async () => {
  const load = new Loader({ idLoad: "load" });
  load.create();
  const content = document.getElementById("content");
  content.classList.add("d-none");
  let hash = getHash();
  let route = resolveRoutes(hash);
  let render = routes[route] ? routes[route] : Error404;
  try {
    await render(content);
    content.classList.remove("d-none");
    load.delete();
  } catch (e) {
    console.log(e);
  }
};
export default router;
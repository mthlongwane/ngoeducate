import { Route, Switch, useRouteMatch } from "react-router-dom";
import Sidebar from "../Sidebar";
import PlayLists from "../Playlists";
import AddPlayList from "../AddPlayList";
import Media from "../Media";
import AddMedia from "../AddMedia";
import AddPlayListFiles from "../AddPlayListFiles";
import NewApplication from "../NewApplication";
import { NewAppProvider } from "../../AppContext";
import Apps from "../Apps";

const Panel = () => {
  const { path } = useRouteMatch();
  return (
    <div className="grid grid-cols-12 gap-4 mt-10" style={{ minHeight: 650 }}>
      <div className="col-span-3">
        <Sidebar />
      </div>

      <div className="col-span-9 rounded-xl bg-gray-100 p-8 w-full">
        <Switch>
          <Route exact path={`${path}/media`}>
            <Media />
          </Route>

          <Route path={`${path}/media/new`}>
            <AddMedia />
          </Route>

          <Route exact path={`${path}/playlists`}>
            <PlayLists />
          </Route>

          <Route path={`${path}/playlists/new/:playListType`}>
            <AddPlayList />
          </Route>

          <Route path={`${path}/playlists/editfile/:type/:playList/:id`}>
            <AddPlayListFiles />
          </Route>

          <Route path={`${path}/apps`}>
            <Apps />
          </Route>
          
          <Route path={`${path}/new-app`}>
            <NewAppProvider>
              <NewApplication />
            </NewAppProvider>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Panel;

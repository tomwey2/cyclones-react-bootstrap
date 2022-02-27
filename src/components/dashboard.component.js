import {useState, useEffect} from "react";
import SeasonsService from "../services/seasons.service";
import CyclonesService from "../services/cyclones.service";
import Season from "./season.component";
import CycloneDetails from "./cyclone.component";
import Cyclones from "./cyclones.component";
import CycloneMap from "./map.component";
import Test from "./test";

const Dashboard = () => {
  const [seasons, setSeasons] = useState([]);
  const [currentSeasonId, setCurrentSeason] = useState("");
  const [cyclones, setCyclones] = useState([]);
  const [currentCyclone, setCurrentCyclone] = useState({});
  const [details, setDetails] = useState([]);

  const onChangeSeason = e => {
    const seasonId = e.target.value;
    console.log("call onChangeSeason: " + seasonId);
    setCurrentSeason(seasonId);
  };

  const onSelectCyclone = cyclone => {
    console.log("call onSelectCyclone: " + cyclone.id);
    setCurrentCyclone(cyclone);
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    fetchCyclones();
    setCurrentCyclone({});
  }, [currentSeasonId]);

  useEffect(() => {
    fetchDetails();
  }, [currentCyclone]);

  const fetchSeasons = async () => {
    console.log("fetchSeasons");
    const response = await SeasonsService.getAll();
    setSeasons(response.data);
    setCurrentSeason(response.data[0]);
    console.log(response.data);
  };

  const fetchCyclones = async () => {
    console.log("fetchCyclones of season " + currentSeasonId);
    const response = await CyclonesService.getAllInSeason(currentSeasonId);
    setCyclones(response.data);
    console.log(response.data);
  };

  const fetchDetails = async () => {
    console.log("fetchDetails");
    if (currentCyclone.id != undefined) {
      const response = await CyclonesService.getDetails(currentCyclone.id);
      setDetails(response.data);
      console.log(response.data);
    } else {
      setDetails([]);
    }
  };

  return (
    <div className="row row-cols-1 row-cols-md-1 row-cols-lg-2">
      <div className="col col-lg-4">
        <div className="card m-3">
          <div className="card-header">
            <h5>List of Cyclones</h5>
            <Season seasons={seasons} onChangeSeason={onChangeSeason} />
          </div>
          <div className="card-body">
            <Cyclones cyclones={cyclones} onSelectCyclone={onSelectCyclone} />
          </div>
        </div>
      </div>

      <div className="col col-lg-8">
        <div className="row row-cols-1">
          <div className="col">
            <CycloneMap />
          </div>
          <div className="col">
            <CycloneDetails cyclone={currentCyclone} details={details} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

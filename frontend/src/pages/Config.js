import React, { useEffect, useState } from "react";
import unchecked from "../resources/unchecked.svg";
import checked from "../resources/checked.svg";
import leftarrow from "../resources/leftarrow.svg";
import rightarrow from "../resources/rightarrow.svg";
import './Config.css';

const Config = () => {
  const [entities, setEntities] = useState({ bear: 0, cat: 0, dog: 0, person: 0 });
  const [sidebarState, setSidebarState] = useState("sidebar-open");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [genInterval, setGenInterval] = useState(20);
  const [detInterval, setDetInterval] = useState(60);
  const [imgLimit, setImgLimit] = useState(10);
  const [sounds, setSounds] = useState([]);
  const [triggerAlarm, setTriggerAlarm] = useState([]);
  const [detect, setDetect] = useState([]);
  const [currentTab, setCurrentTab] = useState("Detectable Entities");

  const Checkbox = (props) => {
    //console.log(props.value)
    const [isChecked, setIsChecked] = useState(false)
    const [icon, setIcon] = useState(unchecked)
    const [altText, setAltText] = useState("unchecked")

    const SwitchCheck = (setting, value) => {
      

      console.debug("Checked")
      if (isChecked) {
        setIsChecked(false);
        setIcon(unchecked)
        setAltText("unchecked")
        var ind;

        switch(setting) {
          case "sounds":
            ind = sounds.indexOf(value)
            sounds.splice(ind, 1)
            break;
          case "triggerAlarm":
            ind = triggerAlarm.indexOf(value)
            triggerAlarm.splice(ind, 1)
            break;
          case "detect":
            ind = detect.indexOf(value)
            detect.splice(ind, 1)
            break;
          default:
            
        }
      }
      else {
        setIsChecked(true);
        setIcon(checked)
        setAltText("checked");

        switch(setting) {
          case "sounds":
            var curSounds = sounds;
            curSounds.push(value);
            setSounds(curSounds)
            break;
          case "triggerAlarm":
            var triggers = triggerAlarm;
            triggers.push(value);
            setTriggerAlarm(triggers);
            break;
          case "detect":
            var detectables = detect;
            detectables.push(value);
            setDetect(detectables);
            break;
          default:
        }
      }
    }


    return (
        <div className="checkbox" onContextMenu={(e)=> e.preventDefault()}>
          <img src={icon} alt={altText} onClick={() => SwitchCheck(props.setting, props.value)}></img>
        </div>
    );
  }

  const SwitchTab = (name) => {
    console.log(name); 
    setCurrentTab(name);
    
    switch(name) {
      case "Detectable Entities":
        document.getElementById('tab1').className = "selected-tab";
        document.getElementById('tab2').className = "sidebar-tab";
        document.getElementById('tab3').className = "sidebar-tab";
        document.getElementById('detect').style.display = "table";
        document.getElementById('alarm').style.display = "none";
        document.getElementById('misc').style.display = "none";
        break;
      case "Customize Alarm":
        document.getElementById('tab1').className = "sidebar-tab";
        document.getElementById('tab2').className = "selected-tab";
        document.getElementById('tab3').className = "sidebar-tab";
        document.getElementById('detect').style.display = "none";
        document.getElementById('alarm').style.display = "table";
        document.getElementById('misc').style.display = "none";
        break;
      case "Misc. Settings":
        document.getElementById('tab1').className = "sidebar-tab";
        document.getElementById('tab2').className = "sidebar-tab";
        document.getElementById('tab3').className = "selected-tab";
        document.getElementById('detect').style.display = "none";
        document.getElementById('alarm').style.display = "none";
        document.getElementById('misc').style.display = "table";
        break;
      default:
    }
        
  }

  const Tab = (props) => {

    const state = currentTab === props.name ? "selected-tab" : "sidebar-tab";

    return (
        <div className={state} onContextMenu={(e)=> e.preventDefault()}>
          <button id={props.id} className={state} onClick={() => SwitchTab(props.name)}>{props.name}</button>
        </div>
    );
  }

  const SwitchSidebar = () => {
    console.log(sidebarState)
    if (sidebarOpen) {
      setSidebarState("sidebar-closed");
      setSidebarOpen(false)
      document.getElementById('open').style.display = 'none';
      document.getElementById('closed').style.display = 'block';
    }
    else {
      setSidebarState("sidebar-open");
      setSidebarOpen(true)
      document.getElementById('open').style.display = 'block';
      document.getElementById('closed').style.display = 'none';
    }    
  }

  const Collapse = (props) => {

    return (
      <div className={props.state} onContextMenu={(e)=> e.preventDefault()}>
        <img display="hidden" src={props.state === "sidebar-open" ? leftarrow : rightarrow} alt={props.state} onClick={SwitchSidebar}></img>
      </div>
  );
  }

  const Submit = (props) => {

    const SendConfig = () => {
      var config = {
        "sounds": sounds,
        "triggerAlarm": triggerAlarm,
        "detect": detect,
        "genInterval": Number(genInterval),
        "detInterval": Number(detInterval),
        "imgLimit": Number(imgLimit),
      }

      console.log(JSON.stringify(config));
    }

    return (
      <div className="submitBtn" onContextMenu={(e)=> e.preventDefault()}>
        <button className="submitBtn" onClick={SendConfig}>Send</button>
      </div>
    );
  }

  useEffect(() => {
    fetch("/api/pi/config")
      .then((res) => res.json())
      .then((data) => setEntities(data.entites));
  }, []);

  const handleChange = (key, value) => {
    setEntities((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    fetch("/api/pi/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entities),
    }).then(() => alert("Config sent to Pi!"));
  };

  return (
    <div className="content">
      <div id="open" className="sidebar">
        <Collapse state={sidebarState}></Collapse>
        <Tab id="tab1" name="Detectable Entities"></Tab>
        <Tab id="tab2" name="Customize Alarm"></Tab>
        <Tab id="tab3" name="Misc. Settings"></Tab>
        <Submit></Submit>
      </div>
      <div id="closed" style={{display: "none"}} className="open-sidebar">
        <Collapse state={sidebarState}></Collapse>
      </div>
      <div id="page" className="page">
        <table id="detect" className="settings">
          <tr className="column-names">
            <th>Entity</th>
            <th className="select">Detect</th>
            <th className="select">Trigger Alarm</th>
          </tr>
          <tr>
            <td>Bear</td>
            <td><Checkbox setting="detect" value={21}></Checkbox></td>
            <td><Checkbox setting="triggerAlarm" value={21}></Checkbox></td>
          </tr>
          <tr>
            <td>Cat</td>
            <td><Checkbox setting="detect" value={15}></Checkbox></td>
            <td><Checkbox setting="triggerAlarm" value={15}></Checkbox></td>
          </tr>
          <tr>
            <td>Dog</td>
            <td><Checkbox setting="detect" value={16}></Checkbox></td>
            <td><Checkbox setting="triggerAlarm" value={16}></Checkbox></td>
          </tr>
          <tr>
            <td>Person</td>
            <td><Checkbox setting="detect" value={0}></Checkbox></td>
            <td><Checkbox setting="triggerAlarm" value={0}></Checkbox></td>
          </tr>
        </table>
        <table style={{display: "none"}} id="alarm" className="settings">
          <tr className="column-names">
            <th>Sound</th>
            <th className="select">Include</th>
            <th className="select">Play</th>
          </tr>
          <tr>
            <td>Airhorn</td>
            <td><Checkbox setting="sounds" value={"airhorn"}></Checkbox></td>
            <td><Checkbox></Checkbox></td>
          </tr>
          <tr>
            <td>Glass</td>
            <td><Checkbox setting="sounds" value={"glass"}></Checkbox></td>
            <td><Checkbox></Checkbox></td>
          </tr>
          <tr>
            <td>Whistle</td>
            <td><Checkbox setting="sounds" value={"whistle"}></Checkbox></td>
            <td><Checkbox></Checkbox></td>
          </tr>
          <tr>
            <td>Laser</td>
            <td><Checkbox setting="sounds" value={"laser"}></Checkbox></td>
            <td><Checkbox></Checkbox></td>
          </tr>
          <tr>
            <td>Pots and Pans</td>
            <td><Checkbox setting="sounds" value={"potsnpans"}></Checkbox></td>
            <td><Checkbox></Checkbox></td>
          </tr>
        </table>
        <table style={{display: "none"}} id="misc" className="settings">
          <tr className="column-names">
            <th>Option</th>
            <th className="select">Value</th>
          </tr>
          <tr>
            <td>General Capture Interval</td>
            <td className="select"><input
              type="number"
              id="genCap"
              value={genInterval}
              onChange={e => setGenInterval(e.target.value)}
              onWheel={(e) => e.target.blur()}
            /></td>
          </tr>
          <tr>
            <td>Detection Interval</td>
            <td className="select"><input
              type="number"
              id="detCap"
              value={detInterval}
              onChange={e => setDetInterval(e.target.value)}
              onWheel={(e) => e.target.blur()}
            /></td>
          </tr>
          <tr>
            <td>Image Limit</td>
            <td className="select"><input
              type="number"
              id="imgLim"
              value={imgLimit}
              onChange={e => setImgLimit(e.target.value)}
              onWheel={(e) => e.target.blur()}
            /></td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default Config;

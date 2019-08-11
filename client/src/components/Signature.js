import React, { Component } from "react";
import SvgIcon from "./SvgIcon";
import axios from "axios";
class Signature extends Component {
  isPainting = false;
  prevPos = { offsetX: 0, offsetY: 0 };
  state = { showStatus: false };

  //device oritentation for mobile!!!!!
  onMouseDown = e => {
    this.isPainting = true;
    this.prevPos = {
      offsetX: e.nativeEvent.offsetX || e.touches[0].clientX,
      offsetY:
        e.nativeEvent.offsetY || e.touches[0].clientY - this.canvas.offsetTop
    };
  };

  onMouseMove = e => {
    if (this.isPainting) {
      const offSetData = {
        offsetX: e.nativeEvent.offsetX || e.touches[0].clientX,
        offsetY:
          e.nativeEvent.offsetY || e.touches[0].clientY - this.canvas.offsetTop
      };
      this.paint(this.prevPos, offSetData);
    }
  };
  endPaintEvent = () => {
    if (this.isPainting) {
      this.isPainting = false;
    }
  };
  paint = (prevPos, currPos) => {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  };
  componentDidMount() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 5;
  }
  clearSignature = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };
  saveSignature = () => {
    const data = this.canvas.toDataURL("image/png");
    const fetchData = async () => {
      const result = await axios.post("http://localhost:4000/api/update", {
        data: '"' + data + '"',
        column: "signature"
      });
      this.props.setUpdate(!this.props.updateStatus);
      this.setState({ showStatus: true, serverPostData: result.data });
    };
    fetchData();
  };

  render() {
    return (
      <>
        {this.state.showStatus && (
          <div
            className="status"
            onClick={() =>
              this.setState({ showStatus: !this.state.showStatus })
            }>
            <div> {this.state.serverPostData}</div>
            <div>X</div>
          </div>
        )}
        <canvas
          ref={ref => (this.canvas = ref)}
          width={window.innerWidth}
          height={window.innerHeight - 132}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}
          onTouchStart={this.onMouseDown}
          onTouchEnd={this.endPaintEvent}
          onTouchMove={this.onMouseMove} />
        <div className="signatureControls">
          <button className="btn danger" onClick={this.clearSignature}>
            <SvgIcon name="delete" />
            Löschen{" "}
          </button>
          <button className="btn notify" onClick={this.saveSignature}>
            <SvgIcon name="confirm" />
            Übernehmen{" "}
          </button>
        </div>
      </>
    );
  }
}

export default Signature;

class Timer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
     sessionLength: 25,
     breakLength: 5, 
     alarm: {color: 'green'},
     timer: 1500, // or we have 16:40
     stateTimer: 'stop',
     intervalID: '',
     timerLabel: 'Session'
    }
    this.handleBreakLength = this.handleBreakLength.bind(this);
    this.handleSessionLength = this.handleSessionLength.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.spendTime = this.spendTime.bind(this);
    this.phaseTimer = this.phaseTimer.bind(this);
    this.minSec = this.minSec.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.handleCountDown = this.handleCountDown.bind(this);
  }
  
  handleBreakLength(e){
    if(this.state.stateTimer === 'stop'){
      if(e.currentTarget.value === '-' && this.state.breakLength != 1){
        this.setState({breakLength: this.state.breakLength - 1});
      }else if(e.currentTarget.value === '+' && this.state.breakLength < 60){
        this.setState({breakLength: this.state.breakLength + 1})
      }
    }
  }
   handleSessionLength(e){
    if(this.state.stateTimer === 'stop'){
      if(e.currentTarget.value === '-' && this.state.sessionLength != 1){ // set count length time
        this.setState({
          sessionLength: this.state.sessionLength - 1,
          timer: this.state.sessionLength * 60 - 60   // change time display timer
       });
      }else if(e.currentTarget.value === '+' && this.state.sessionLength < 60){
        this.setState({
          sessionLength: this.state.sessionLength + 1,
          timer: this.state.sessionLength * 60 + 60
        })
      }
    }
  }
  
  handleStartStop(){
    if(this.state.stateTimer === 'stop'){
      this.handleCountDown()
      this.setState({
        stateTimer: 'run',
      })
    }else{
      this.setState({stateTimer: 'stop'})
      this.handleStop()
    }
  }
  handleCountDown(){ // separate function prevents stiking time
    this.intTime = setInterval(() => {
          this.spendTime();         // change state in another separate function
          this.phaseTimer();   // if we have less time 
        }, 1000)
    this.setState({
        intervalID: this.intTime
      })
  }
  handleStop(){
      this.setState({
        stateTimer: 'stop',
        intervalID: clearInterval(this.state.intervalID)
      })
      
  }
  spendTime(){
    this.setState({timer: this.state.timer - 1});
  }
  phaseTimer(){
    this.state.timer <= 60  ?  // if we have only 60 sec
      this.setState({alarm: {color: 'red'}}) :  
      this.setState({alarm: {color: 'green'}});
     
    if(this.state.timer < 0){
      this.audio.play();
     
      if(this.state.timerLabel === 'Session'){ // like condition: change label and time for the last save time
        this.handleStop(); // reach 00:00
        this.setState({
            timerLabel:'Break',
            timer: this.state.breakLength * 60,
            alarm: {color: 'orange'}
           })
       this.handleStartStop() // run with new options
      }else if(this.state.timerLabel === 'Break' ) {
        this.handleStop();
        this.setState({
            timerLabel:'Session',
            timer: this.state.sessionLength * 60,
            alarm: {color: 'green'}
           })
        this.handleStartStop()
      }
      
    }
  }
  
  minSec(){
    let min = Math.floor(this.state.timer/60);
    let sec = this.state.timer - min * 60;
    if(sec < 10) sec = '0' + sec;
    if(min < 10) min = '0' + min;
    return min + ":" + sec;
  }
  resetTimer(){
    this.setState({
     sessionLength: 25,
     breakLength: 5,
     alarm: {color: 'green'},
     timer: 1500,
     stateTimer: 'stop',
     intervalID: '',
     timerLabel: 'Session'
    });
    this.handleStop();
    this.audio.pause();
    this.audio.currentTime = 0;
  }
  render(){
    return(
      <div>
        <audio id="beep" 
          ref={ref => this.audio = ref}
          src='http://www.downloadfreesound.com/wp-content/uploads/2014/07/Beep_6.mp3'
          autoplay
           >
        </audio>
        <div className="promodoro">Promodoro Clock</div>
        
        <div className="clockTimer" style={this.state.alarm}>
          <div id="timer-label">
            {this.state.timerLabel}
          </div>
          <div id="time-left">
            {this.minSec()}
          </div>
        </div>
        <div className="buttonsGroup">
          <button id="start_stop" className="btn btn-info" onClick={this.handleStartStop}>
            <span className="fas fa-play-circle"></span>
          </button>
          <button id="start_stop" className="btn btn-info" onClick={this.handleStop}>
            <i className="fas fa-pause-circle"></i>
          </button>
          <button id="reset" className="btn btn-info" onClick={this.resetTimer}>
            <i className="fas fa-redo"></i>
          </button>
        </div>
        <div id="box">
          <Session 
            sessionLength={this.state.sessionLength}
            onSessionClick={this.handleSessionLength}
            />
          <Break
            breakLength={this.state.breakLength}
            onBreakClick={this.handleBreakLength}
            />
        </div>
      </div>
    )
  }
}
class Session extends React.Component{
  render(){
    return(
      <div id="sessionBlock">
        <div id="session-label">
          Session Length
        </div>
        <div id="butSession">
          <button 
            id="session-decrement"
            value="-"
            onClick={this.props.onSessionClick}
            className="btn btn-primary"
            >
            <i class="far fa-minus-square"></i>
          </button>
          <div id="session-length" >
            {this.props.sessionLength}
          </div>
          <button id="session-increment"
            value="+"
            onClick={this.props.onSessionClick}
            className="btn btn-primary"
            >
            <i class="far fa-plus-square"></i>
          </button>
        </div>
      </div>
    )
  }
}
class Break extends React.Component{
  render(){
    return(
      <div>
       <div id="breakBlock">
        <div id="break-label">
          Break Length
        </div>
         <div id="butBreak">
            <button 
              id="break-decrement"
              value="-"
              onClick={this.props.onBreakClick}
              className="btn btn-primary"
              >
              <i class="far fa-minus-square"></i>
            </button>
            <div id="break-length" >
              {this.props.breakLength}
            </div>
            <button 
              id="break-increment"
              className="btn btn-primary"
              value="+"
              onClick={this.props.onBreakClick}
              >
              <i class="far fa-plus-square"></i>
            </button>
         </div>
        </div>
      </div>
    )
  }
}
ReactDOM.render(<Timer />, document.getElementById("root"));

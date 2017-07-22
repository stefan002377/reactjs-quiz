import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './css/style.css';
import $ from "jquery";

class QuizMain extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allData: [],
      curentQuestionId: 1,
      responseCorect: [],
      finalResult: false,
      finalScore: 0,
      responsQuestion: []
    };
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.selectResponse = this.selectResponse.bind(this);
    this.showResult = this.showResult.bind(this);
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  prevQuestion() {
    this.setState({
      curentQuestionId: this.state.curentQuestionId - 1,
    });
  }

  nextQuestion() {
    this.setState({
      curentQuestionId: this.state.curentQuestionId + 1,
    });
  }

  showResult() {
    let fs = this.state.responseCorect.filter((s,i) => s==this.state.responsQuestion[i])
    this.setState({
      finalResult: true,
      finalScore: fs.length*100/this.state.allData.length
    });
  }

  selectResponse(respons) {
    this.state.responsQuestion[this.state.curentQuestionId-1] = respons;
    this.setState({
      responsQuestion: this.state.responsQuestion,
    });
  }

  fetchQuestions() {
    $.ajax({
      method: 'GET',
      url: '/data/questions.json',
      success: (listQuestions) => {
        this.setState({
          allData: listQuestions,
          responseCorect: listQuestions.map( c => c.corect)
        });
      }
    });
  }

  render() {

    if(this.state.finalResult==0) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <h2 className="pull-left">Quiz Test IQ</h2>
            <h5 className="nquest pull-right">{this.state.curentQuestionId}/{this.state.allData.length} Questions</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="progress">
              <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style={{width: this.state.responsQuestion.length*100/this.state.allData.length+"%"}}>
                {this.state.responsQuestion.length>0 && (Math.round(this.state.responsQuestion.length*100/this.state.allData.length))+"% Complete"}
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-md-12 col-lg-12 col-sm-12">
            {this.state.allData.map( q =>
              this.state.curentQuestionId==q.id_q &&
              <div key={q.id_q}>
                <p className="contentQuestion">{q.title}</p>
                {q.respons.map( r =>
                  <div className={"btn col-md-5 col-lg-5 col-sm-5 " + (this.state.responsQuestion[this.state.curentQuestionId-1]==r.id_r ? 'btn-info' : 'btn-default')} onClick={() => this.selectResponse(r.id_r)} key={r.id_r}>
                    {r.title}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="row text-center footerbutton">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <p>
              {this.state.curentQuestionId > 1 && <div className="btn btn-warning" onClick={this.prevQuestion}>Prev Question</div>}
              {this.state.curentQuestionId < this.state.allData.length && <div className="btn btn-warning" onClick={this.nextQuestion}>Next Question</div>}
              {this.state.curentQuestionId == this.state.allData.length && <div className="btn btn-success" onClick={this.showResult}>Show Result</div>}
            </p>
          </div>
        </div>
      </div>
    )
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-12 col-sm-12 text-center">
              <h2>Thank You!!!</h2>
              <h4 className="sub-final">Your final score is <span>{Math.round(this.state.finalScore)}%</span>, you are a genius</h4>
            </div>
          </div>
        </div>
      )
    }
  }
}

ReactDOM.render(<QuizMain/>, document.getElementById('root'));

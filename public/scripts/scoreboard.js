var React = require('react');
var Router = require('react-router');
var Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    RouteHandler = Router.RouteHandler,
    Link = Router.Link;

/* All of the logos of MLB teams are stored in a single .PNG file. This table
 * defines the offsets into that table for the logos of a specific team. The
 * keys are taken from standard values in the MLB GameDay data stream */
var logo_offsets = {
    ana: -413,
    ari: -30,
    atl: -62,
    bal: -94,
    bos: -126,
    chn: -158,
    cin: -190,
    cle: -221,
    col: -253,
    cha: -286,
    det: -319,
    fla: -478,
    hou: -350,
    kca: -382,
    lan: -447,
    mia: -478,
    mil: -510,
    min: -543,
    nyn: -574,
    nya: -606,
    oak: -637,
    phi: -668,
    pit: -701,
    sdn: -734,
    sea: -766,
    sfn: -798,
    sln: -830,
    tba: -863,
    tex: -893,
    tor: -925,
    was: -956
};

/* The TeamSummary component generates a small view that contains:
 * 1. The team's logo
 * 2. The team's 3 letter abbreviation (e.g., LAA for the LA Angels)
 * 3. The team's current win-loss record */
var TeamSummary = React.createClass({
    render: function() {
        var style = {
            width: '65px',
            height: '36px',
            paddingLeft: '38px',
            marginLeft: '4px',
            verticalAlign: 'middle',
            display: 'table-cell',
            textAlign: 'left',
            backgroundImage: 'url(/2014_logo_sprite.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '-31px ' + (logo_offsets[this.props.code]) + 'px',
            backgroundSize: '64px auto'
        }
        var record = {
            fontSize: '11px',
            fontWeight: 'normal',
            color: '#999',
            lineHeight: '13px'
        }
        var abbr = {
            fontSize: '13px',
            fontWeight: 'bold',
            lineHeight: '15px'
        }
        var runs = {
            fontSize: '13px',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '30px',
            height: '38px',
            background: '#e5e5e5',
            borderTop: '1px solid #ccc',
            borderLeft: '1px solid #ccc'
        }
        var count = {
            fontSize: '13px',
            textAlign: 'center',
            width: '30px',
            height: '38px',
            borderTop: '1px solid #ccc',
            borderLeft: '1px solid #ccc'
        }
        var team = {
            borderTop: '1px solid #ccc'
        }
        return ( 
            <tr>
            <th style={team}>
                <div style={style}>
                    <abbr style={abbr}>{this.props.abbr.toUpperCase()}</abbr><br/>
                    <span style={record}>({this.props.wins}-{this.props.losses})</span>
                </div>
            </th>
            <td style={runs}>{this.props.runs}</td>
            <td style={count}>{this.props.hits}</td>
            <td style={count}>{this.props.errors}</td>
            </tr>
        );
    }
});

/* This component renders the list of games.
 * TODO: I need to refactor some of this code into the Scoreboard component.
 * TODO: This component should just render a single game card, not a list. */
var GameList = React.createClass({
    render: function() {
        var boxScore = {
            margin: '10px',
            borderSpacing: '0px',
            border: '1px solid #ccc',
        }
        var status = {
            fontSize: '13px',
            padding: '6px',
            verticalAlign: 'middle',
            height: '17px'
        }
        var runs = {
            fontWeight: 'bold',
            borderLeft: '1px solid #ccc'
        }
        var count = {
            fontWeight: 'normal',
            color: '#999'
        }
        var flexbox = {
            display: 'flex',
            flexWrap: 'wrap',
            flexFlow: 'row wrap'
        }
        var selectedBoxscore = {
            borderWidth: '5px'
        }
        var scoreboard = this.props.scoreboard;
        var gameList = ( <tr /> );
        if (scoreboard !== null) {
            var game = scoreboard.game[0];
            gameList = scoreboard.game.map(function(game) {
                return (
                    /* Note here that I am passing home_name_abbrev and
                     * away_name_abbrev because I don't know how to access the
                     * master component's state. I think this should be possible
                     * so TODO: figure out how to do this */
                    <Link to='game' activeStyle={selectedBoxscore} params={{ gid: game.gameday, home: game.home_name_abbrev, away: game.away_name_abbrev }}>
                    <table style={boxScore}>
                    <thead>
                        <td style={status}>{game.status.status}/{game.status.inning}</td>
                        <th style={runs}><abbr title='runs'>R</abbr></th>
                        <th style={count}><abbr title='hits'>H</abbr></th>
                        <th style={count}><abbr title='errors'>E</abbr></th>
                    </thead>
                    <tbody>
                        <TeamSummary 
                            code={game.away_code} 
                            abbr={game.away_name_abbrev} 
                            wins={game.away_win} 
                            losses={game.away_loss}
                            hits={game.linescore.h.away}
                            runs={game.linescore.r.away}
                            errors={game.linescore.e.away}
                            /> 
                         <TeamSummary 
                            code={game.home_code} 
                            abbr={game.home_name_abbrev} 
                            wins={game.home_win} 
                            losses={game.home_loss} 
                            hits={game.linescore.h.home}
                            runs={game.linescore.r.home}
                            errors={game.linescore.e.home}
                            />
                    </tbody></table>
                    </Link>
                );
            });
        }
        return (
            <div style={flexbox}> {gameList} </div>
        );
    }
});

/* React component that represents the scoreboard card-based view. Clicking on a
 * card on the scoreboard will trigger an action to display details about the
 * selected card.
 * TODO: move some code from the GameList component into this component so that
 * it will render the list of Game components. Right now, as implemented, it's
 * not a clear division of responsibility between this component and the
 * GameList component. This is an artifact of the original React tutorial code
 * which has a similar, somewhat confusing non-separation of concerns. */
var Scoreboard = React.createClass({
    getInitialState: function() {
        return {scoreboard: null};
    },

    /* Clean the data that comes back from the site */
    cleanData: function(scoreboard) {
        // Walk games
        scoreboard.game.map(function(game) {
            if (game.linescore === undefined) {
                game.linescore = {
                    h: {
                        home: 0,
                        away: 0
                    },
                    r: {
                        home: 0,
                        away: 0
                    },
                    e: {
                        home: 0,
                        away: 0
                    }
                }
            }
        });
        return scoreboard;
    },

    componentDidMount: function() {
        var year = this.props.date.getFullYear();
        var month = this.props.date.getMonth() + 1;
        var day = this.props.date.getDate();
        $.ajax({
            url: '/scoreboard/' + year + '/' + month + '/' + day,
            dataType: 'json',
            success: function(data) {
                var data = this.cleanData(data);
                this.setState({scoreboard: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function() {
        var scoreboard = this.state.scoreboard;
        var games = (scoreboard === null) ? 'no' : scoreboard.game.length;
        return (
            <div>
                <div>There are {games} games for {this.props.date.toDateString()}</div>
                <GameList scoreboard={scoreboard} />
            </div>
        );
    }
});

var today = new Date();

/* App holds master and detail */
var App = React.createClass({
    render: function() {
        return (
            <div>
                <Scoreboard date={today} />
                <Game />
            </div>
        )
    }
});

/* Index contains the master */
var Index = React.createClass({
    render: function() {
        return (
            <Scoreboard date={today} />
        );
    }
});

var inningCellStyle = {
    border: '1px solid #d7d7d7',
    width: '1.4em',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '6px'
}

var headerCellStyle = {
    fontSize: '10px',
    fontWeight: 'normal',
    color: '#666',
    padding: '2px',
    textAlign: 'center'
}

var inningTableStyle = {
    borderSpacing: '0px'
}

/* This entire section doesn't feel quite right - very verbose. 
 * I think I'm likely doing something wrong right now here */
var HeaderCell = React.createClass({
    render: function() { return (<th style={headerCellStyle}>{this.props.inning.inning}</th>); }
});

var HomeCell = React.createClass({
    render: function() { return (<td style={inningCellStyle}>{this.props.inning.home}</td>); }
});

var AwayCell = React.createClass({
    render: function() { return (<td style={inningCellStyle}>{this.props.inning.away}</td>); }
});

var HeaderRow = React.createClass({
    render: function() {
        return (
        <tr>
            <th></th>
            {this.props.innings.map(function(inning) {
                return (<HeaderCell inning={inning} />)
            })}
        </tr>);
    }
});

var HomeRow = React.createClass({
    render: function() {
        return (
        <tr>
            <td style={inningCellStyle}>{this.props.team}</td>
            {this.props.innings.map(function(inning) {
                return (<HomeCell inning={inning} />)
            })}
        </tr>);
    }
});

var AwayRow = React.createClass({
    render: function() {
        return (
        <tr>
            <td style={inningCellStyle}>{this.props.team}</td>
            {this.props.innings.map(function(inning) {
                return (<AwayCell inning={inning} />)
            })}
        </tr>);
    }
});

/* Game contains a LineScore component */
var LineScore = React.createClass({
    render: function() {
        var linescore = this.props.linescore;
        var heading = (<HeaderRow innings={linescore} />);

        return (
            <div>
            <table style={inningTableStyle}>
            <thead>
                <HeaderRow innings={linescore} />
            </thead>
            <tbody>
                <AwayRow team={this.props.away} innings={linescore} />
                <HomeRow team={this.props.home} innings={linescore} />
            </tbody>
            </table>
            </div>
        )
    }
});

/* Game contains the detail */
var Game = React.createClass({
    /* Interestingly enough, if you omit this method, there is no state property */
    getInitialState: function() {
        return {scoreboard: null};
    },

    contextTypes: {
        router: React.PropTypes.func
    },
    /* This method is invoked via a route */
    componentWillReceiveProps: function() {
        var gid = this.context.router.getCurrentParams().gid;
        $.ajax({
            url: '/boxscore/gid_' + gid,
            dataType: 'json',
            success: function(data) {
                this.setState({scoreboard: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        var scoreboard = this.state.scoreboard;
        var home = this.context.router.getCurrentParams().home;
        var away = this.context.router.getCurrentParams().away;
        if (scoreboard !== null && scoreboard.data !== null) {
            var boxscore = scoreboard.data.boxscore;
            var linescore = boxscore.linescore;
            return (
                <div>
                    <LineScore home={home} away={away} linescore={linescore.inning_line_score} />
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    }
});

/* Defining the routes available to the UI */
var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Index}/>
        <Route name='game' path='game/:gid/:away/:home' handler={Game}/>
    </Route>
);

Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});

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
        var scoreboard = this.props.scoreboard;
        var gameList = ( <tr /> );
        if (scoreboard !== null) {
            var game = scoreboard.game[0];
            gameList = scoreboard.game.map(function(game) {
                return (
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
                );
            });
        }
        return (
            <div style={flexbox}> {gameList} </div>
        );
    }
});

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

React.render(
    <Scoreboard date={today} />,
    document.getElementById('content')
);

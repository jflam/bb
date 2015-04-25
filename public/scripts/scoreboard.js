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
            fontSize: '13px',
            width: '500px',
            height: '32px',
            paddingLeft: '30px',
            backgroundImage: 'url(/2014_logo_sprite.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '-32px ' + logo_offsets[this.props.code] + 'px',
            backgroundSize: '64px auto'
        }
        return ( 
            <td style={style}>
                {this.props.code.toUpperCase()} ({this.props.wins}-{this.props.losses})
            </td>
        );
    }
});

var GameList = React.createClass({
    render: function() {
        var scoreboard = this.props.scoreboard;
        var gameList = ( <tr /> );
        if (scoreboard !== null) {
            var game = scoreboard.game[0];
            /*
            gameList = (
                    <tr>
                        <TeamSummary code={game.away_code} wins={game.away_win} losses={game.away_loss} /> 
                        <TeamSummary code={game.home_code} wins={game.home_win} losses={game.home_loss} />
                    </tr>
                );
            */
            gameList = scoreboard.game.map(function(game) {
                return (
                    <tr>
                        <TeamSummary code={game.away_code} wins={game.away_win} losses={game.away_loss} /> 
                        <TeamSummary code={game.home_code} wins={game.home_win} losses={game.home_loss} />
                    </tr>
                );
            });
        }
        return (
            <table>
                <tbody>{gameList}</tbody>
            </table>
        );
    }
});

var Scoreboard = React.createClass({
    getInitialState: function() {
        return {scoreboard: null};
    },

    componentDidMount: function() {
        var year = this.props.year;
        var month = this.props.month;
        var day = this.props.day;
        $.ajax({
            url: '/scoreboard/' + year + '/' + month + '/' + day,
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
        var games = (scoreboard === null) ? 'no' : scoreboard.game.length;
        return (
            <div>
                <div>There are {games} games for {this.props.year}-{this.props.month}-{this.props.day}</div>
                <GameList scoreboard={scoreboard} />
            </div>
        );
    }
});

React.render(
    <Scoreboard year='2014' month='04' day='23' />,
    document.getElementById('content')
);

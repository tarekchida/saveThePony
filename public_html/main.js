/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var maze = {
    apiUrl: "https://ponychallenge.trustpilot.com/pony-challenge/",
    id: "",
    status: {},
    /**
     * Init game settings and container
     *  
     */
    init: function () {

        maze.id = "";
        maze.status = {};
        $('.maze-pony').hide();
        $('.maze-init').show();
        $('.maze-console').text('');
        $('#maze-end').attr('src', '');
        maze.config();

        // start the maze
        $('#maze-form').submit(function (event) {
            event.preventDefault();

            var params = new Object();
            params['maze-width'] = parseInt($('#mazeWidth').val());
            params['maze-height'] = parseInt($('#mazeHeight').val());
            params['maze-player-name'] = $('input[name="mazePlayerName"]:checked').val();
            params.difficulty = parseInt($('#difficulty').val());
            var apiResponse = maze.apiRequest(JSON.stringify(params), 'POST', 'maze');

            if (apiResponse.maze_id) {
                maze.id = apiResponse.maze_id;
                maze.start();
            }

            return false;
        });
    },
    /**
     * Manage game settings
     *  
     */
    config: function () {
        $("input.slider").slider();
        $('#mazeWidth').change(function () {
            $('.mWidth').text($(this).val());
        });
        $('#mazeHeight').change(function () {
            $('.mHight').text($(this).val());
        });
        $('#difficulty').change(function () {
            $('.mdiff').text($(this).val());
        });
    },
    /**
     * Start the Maze
     *  
     */
    start: function () {
        $('.maze-init').hide();
        maze.consoleMsg("Maze Started", 'success');
        $('.maze-pony').show();

        // get maze status
        maze.status = maze.apiRequest({}, 'GET', 'maze/' + maze.id);
        if (maze.status['game-state'].state == "Active") {
            maze.print();
        } else {
            maze.init();
        }

    },
    /**
     * Print the maze in a table
     *  
     */
    print: function () {
        $('.game-container table').html('');

        html = '<tr>';
        $.each(maze.status.data, function (key, walls) {

            avatar = maze.getAvatar(key);
            if (key % maze.status.size[0] == 0 && key >= maze.status.size[0]) {
                html = html + '</tr><tr>';
            }
            html = html + '<td data-pos="' + key + '"  class="wall-' + walls.join("-") + avatar + '"></td>';

        });

        html = html + '</tr>';
        $('.game-container table').append(html);
    },
    /**
     * Get the poistion avatar
     * @param {type} x
     * @returns {String|avatar}
     */
    getAvatar: function (x) {
        var pony = maze.status.pony[0];
        var domokun = maze.status.domokun[0];
        var endPoint = maze.status['end-point'][0];

        switch (x) {
            case pony:
                avatar = " player";
                break;
            case domokun:
                avatar = " domokun";
                break;
            case endPoint:
                avatar = " end-point";
                break;
            default:
                avatar = "";
                break;
        }
        return avatar;
    },
    /**
     * Manage direction and keys
     * 
     */
    getDirection: function () {
        $(document).keydown(function (e) {
            switch (e.which) {
                case 37:
                    maze.consoleMsg("Move : west", 'info');
                    maze.nextMove('west');
                    break;
                case 38:
                    maze.consoleMsg("Move : north", 'info');
                    maze.nextMove('north');
                    break;
                case 39:
                    maze.consoleMsg("Move : east", 'info');
                    maze.nextMove('east');
                    break;
                case 40:
                    maze.consoleMsg("Move : south", 'info');
                    maze.nextMove('south');
                    break;
                default:
                    return;
            }
            e.preventDefault();
        });

        $('.maze-direction div.direction').click(function () {
            var direction = $(this).attr('data-direction');
            maze.consoleMsg("Move : " + direction, 'info');
            maze.nextMove(direction);
        });
    },
    /**
     * Next move in the maze
     * @param {type} direction
     *  
     */
    nextMove: function (direction) {
        params = new Object();
        params.direction = direction;
        var response = maze.apiRequest(JSON.stringify(params), 'POST', 'maze/' + maze.id);

        // maze ends win/loose
        if (response.state == 'won' || response.state == 'over') {
            maze.end(response);
        }
        if (response['state-result'] == "Move accepted") {
            maze.status = maze.apiRequest({}, 'GET', 'maze/' + maze.id);
            maze.print();
            maze.sixSens();
        }

        maze.consoleMsg(response['state-result'], 'warning');
    },
    /**
     * Display hidden url image 
     * @param {type} status
     *  
     */
    end: function (status) {
        $('#maze-end').attr('src', 'https://ponychallenge.trustpilot.com/' + status['hidden-url']);
    },
    /**
     * Display Pony feelings
     *  
     */
    sixSens: function () {
        if (Math.abs(maze.status.pony - maze.status.domokun) < 5) {
            maze.consoleMsg("I have a baad feeling !", 'danger');
        }

        if (Math.abs(maze.status.pony - maze.status['end-point']) < 5) {
            maze.consoleMsg("I can smell freedom !", 'info');
        }
    },
    /**
     * Global api interraction
     * @param {type} params
     * @param {type} type
     * @param {type} url
     * @returns {data}
     */
    apiRequest: function (params, type, url) {
        var apiResponse = {};
        $.ajax({
            type: type,
            url: maze.apiUrl + url,
            data: params,
            Accept: 'application/json',
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType: "json",
            async: false,
            success: function (data, status, jqXHR) {
                apiResponse = data

            },
            error: function (jqXHR, status) {
                console.log(jqXHR);
            }
        });
        return apiResponse;
    },
    /**
     * Display messages in the game console
     * @param {type} msg
     *  
     */
    consoleMsg: function (msg, type) {
        $('.maze-console').scrollspy();
        $('.maze-console').prepend("<p class='alert-" + type + "'>" + msg + "</p>");
    }

};
$(document).ready(function () {
    maze.init();
    maze.getDirection();
    $('.new-maze').click(function () {
        maze.init();
    });
});

let canvas, ctx;
let num = 0; 
let points = [];
let graph = [];
let color = ['white', 'gray', 'black'];
let time = 0;
let c_width = 600, c_height = 600;

let arrow_color = 'rgba(0,0,256,0.4)';

let draw_point = true;
let draw_line = false;
let do_draw_line = false;
let init_x, init_y, init_point;
let r = 20;

class Point {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.d = -1;
        this.f = -1;
        this.pi = -1;
        // 白灰黑 012
        this.color = 0;
    }

    toString() {
        return '('+this.id+': ' + this.x + ', ' + this.y + ', ' +color[this.color]+','+this.pi+')';
    }
}
window.onload = function()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');

    clickInit();

    $(document).keydown(function(e){
        if(e.which === 76) {
            draw_point = false; // l
            do_draw_line = true;
        }

        if(e.which === 67)
        {
            // c
            clear();
        }

        if(e.which === 68)
        {
            //d
            do_draw_line = false;
            DFS(graph, points);
            draw();

        }
    });
};

function clear()
{

    ctx.clearRect(0, 0, c_width, c_height);
    num = 0;
    points = [];
    graph = [];
    time = 0;
    draw_point = true;
    draw_line = false;
    do_draw_line = false;
}

function DFS(graph, points)
{
    time = 0;
    for(let i=0; i<points.length; i++)
    {
        if(points[i].color === 0)
        {
            DFS_VISIT(graph, points, i);
        }
    }
}

function DFS_VISIT(graph, points, i)
{
    let u = points[i];
    time += 1;
    u.d = time;
    u.color = 1;

    let pre_point = graph[i].head;
    for(let j=graph[i].head.next; j !== null; j = j.next)
    {
        if(points[j.element].color === 0)
        {
            points[j.element].pi = i;
            DFS_VISIT(graph, points, j.element);
        }else if(points[j.element].color === 1)
        {
            // 是灰色
            pre_point.next = j.next;
            draw();

        }
        pre_point = j;
    }

    u.color = 2;
    time +=1;
    u.f = time;
}


function clickInit() {
    const c = document.getElementById("canvas");
    c.onmousedown = onClick;
    c.onmousemove = onMove;
    c.onmouseup = onUp;
}

function onClick(e)
{
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    if(e.shiftKey && draw_point)
    {

        let point_temp = new Point(num, x  ,y);
        points.push(point_temp);
        graph[num] = new LList();

        drawCircle(ctx, x, y, num);

        num++;
    }

    if(do_draw_line)
    {

        init_x = x;
        init_y = y;
        for(let i = 0; i<points.length; i++)
        {
            if(cal_distance(x, y, points[i].x, points[i].y) < r)
            {
                init_point = i;
            }

        }
        // console.log(init_point);
        draw_line = true;
    }

}

function onMove(e)
{   

}

function onUp(e)
{
    if(draw_line)
    {
        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;

        drawArrow(ctx, init_x, init_y, x, y, 30, 15, 3, arrow_color);
        let f_point;

        for(let i = 0; i<points.length; i++)
        {
            if(cal_distance(x, y, points[i].x, points[i].y) < r)
            {
                f_point = i;
            }

        }
        // console.log(f_point);

        let j=graph[init_point].head;
        while (j.next)
        {
            j = j.next;
        }
        j.next = new Node(f_point);


        draw_line = false;
    }
}

function cal_distance(x0, y0, x1, y1)
{
    return Math.sqrt(Math.pow((x1-x0),2) + Math.pow((y1-y0),2));
}

function draw()
{
    ctx.clearRect(0, 0, c_width, c_height);

    for(let i=0; i<points.length; i++)
    {
        drawCircle(ctx, points[i].x, points[i].y, points[i].id);
    }

    for(let i=0; i<graph.length; i++)
    {
        for(let j=graph[i].head.next; j !== null; j = j.next)
        {
            drawArrow(ctx, points[i].x, points[i].y, points[j.element].x, points[j.element].y,30, 15, 3, arrow_color);
        }
    }

}



function Node(element){
    this.element = element;
    this.next = null;
}

function LList(){
    this.head = new Node('head');
    this.find = find;
    this.insert = insert;
    //this.remove = remove;
    this.display = display;
}

function find(item){
    let currNode = this.head;
    while (currNode.element != item){
        currNode = currNode.next;
    }
    return currNode;
}

//插入一个元素
function insert(newElement, item){
    let newNode = new Node(newElement);
    let current = this.find(item);
    newNode.next = current.next;
    current.next = newNode;
}

function display(){
    let currNode = this.head;
    while (!(currNode.next == null)){
        document.write(currNode.next.element + '&nbsp;');
        currNode = currNode.next;
    }
}
function drawCircle(ctx, x, y, num)
{
    ctx.beginPath();
    ctx.arc(x,y,r,0,360,false);
    ctx.fillStyle="red";
    ctx.fill();//画实心圆
    ctx.closePath();

    ctx.font = "18px bold 黑体";
    ctx.fillStyle = "#ff0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(num, x, y);
}
function drawArrow(ctx, fromX, fromY, toX, toY, theta, headlen, width, color) {


    theta = typeof(theta) != 'undefined' ? theta : 30;
    headlen = typeof(theta) != 'undefined' ? headlen : 10;
    width = typeof(width) != 'undefined' ? width : 1;
    color = typeof(color) != 'color' ? color : '#000';

    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);

    ctx.save();
    ctx.beginPath();

    let arrowX = fromX - topX,
        arrowY = fromY - topY;

    ctx.moveTo(arrowX, arrowY);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}



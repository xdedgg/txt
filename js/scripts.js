// 获取所有菜单项
const menuItems = document.querySelectorAll('.menu ul li a');

// 获取所有内容部分
const contentSections = document.querySelectorAll('.content');

// 默认显示首页内容
document.getElementById('home').classList.add('active');

// 监听菜单项的点击事件
menuItems.forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault(); // 阻止默认的跳转行为

        // 获取当前点击的菜单项的目标内容部分的 id
        const targetId = this.getAttribute('data-target');

        // 隐藏所有内容部分
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // 显示目标内容部分
        document.getElementById(targetId).classList.add('active');
    });
});



// 监听线路选择下拉菜单的 change 事件
document.getElementById('line-select').addEventListener('change', function() {
    // 获取用户选择的线路值
    const line = this.value;

    // 如果用户选择了有效线路
    if (line) {
        // 发起 fetch 请求，获取 stations.json 文件中的数据
        fetch("data/data.json")
               .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.json(); // 将响应解析为 JSON 格式
            })
            .then(data => {
                // 从 JSON 数据中提取用户选择线路的站点信息
                const stations = data[line];

                // 获取显示站点信息的容器元素
                const stationInfo = document.getElementById('station-info');

                // 清空容器中的内容，以便加载新的站点信息
                stationInfo.innerHTML = '';

                // 遍历当前线路的所有站点
                stations.forEach(station => {
                    // 创建一个 div 元素来显示单个站点的信息
                    const stationDiv = document.createElement('div');
                    stationDiv.className = 'station'; // 添加 CSS 类名

                    // 设置站点信息的 HTML 结构
                    stationDiv.innerHTML = `
                        <div style="width: 5px; height: 20px; background-color: #0077b6;"></div> <!-- 蓝色小竖条 -->
                        <div class="name">${station.name}</div> <!-- 站点名称 -->
                        <div class="transfer">${station.transfer || ''}</div> <!-- 换乘信息，如果没有则为空 -->
                        <div class="feature">${station.feature || ''}</div> <!-- 站点特色信息，如果没有则为空 -->
                    `;

                    // 监听鼠标悬停事件
                    // stationDiv.addEventListener('mouseover', () => {
                        // 如果站点有图片信息
                        // if (station.image) {
                            // 创建一个 img 元素
                            // const img = document.createElement('img');
                            // img.src = station.image; // 设置图片路径
                            // img.style.width = '100px'; // 设置图片宽度
                            // stationDiv.appendChild(img); // 将图片添加到站点信息 div 中
                        // }
                    // });

                    // 监听鼠标离开事件
                    stationDiv.addEventListener('mouseout', () => {
                        // 获取站点信息 div 中的图片元素
                        const img = stationDiv.querySelector('img');
                        // 如果图片存在，则移除图片
                        if (img) {
                            img.remove();
                        }
                    });

                    // 将站点信息 div 添加到容器中
                    stationInfo.appendChild(stationDiv);
                });
            });
    }
});

// 监听“询问”按钮的点击事件
document.getElementById('ask-btn').addEventListener('click', function() {
    // 获取用户输入的问题
    const question = document.getElementById('question').value;

    // 如果用户输入了问题
    if (question) {
        // 在响应区域显示“加载中…”提示
        document.getElementById('response').innerText = '加载中…';

        // 发起 fetch 请求，向服务器发送问题
        fetch('/ask', {
            method: 'POST', // 使用 POST 方法
            headers: {
                'Content-Type': 'application/json', // 设置请求头为 JSON 格式
            },
            body: JSON.stringify({ question: question }), // 将问题转换为 JSON 格式并发送
        })
            .then(response => response.json()) // 将响应解析为 JSON 格式
            .then(data => {
                // 将服务器返回的答案显示在响应区域
                document.getElementById('response').innerText = data.answer;
            });
    }
});

// 开始游戏的函数
function startGame() {
    // 获取嵌入游戏的 iframe 元素
    const iframe = document.getElementById('game-iframe');

    // 向 iframe 发送消息，通知游戏开始
    iframe.contentWindow.postMessage('start', '*');
}

// 停止游戏的函数
function stopGame() {
    // 获取嵌入游戏的 iframe 元素
    const iframe = document.getElementById('game-iframe');

    // 向 iframe 发送消息，通知游戏停止
    iframe.contentWindow.postMessage('stop', '*');
}
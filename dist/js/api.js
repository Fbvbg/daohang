var api="https://gitee.com/api/v5/repos/";
var access_token="58bb58141857541d2a5a667bb76a197a";
var owner = "free163";
var repo = "daohang";
var db_file="daohang.json";


//文件是否存在
function getFileExists(path) {
	var exists = false;
	mui.ajax(api+ owner + '/' + repo + '/contents/' + path + '?access_token=' +
		access_token, {
			beforeSend: function(xhr) {
				// xhr.setRequestHeader("Authorization:'token a3e5298bd2b3693e967b63636e6526f0ae47044d'");
			},
			data: {},
			async: false,
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data == "") {
					exists = false;
				} else {
					exists = true;
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log(xhr)
				exists = false;
			}
		});
	return exists;
}

//创建文件
// https://gitee.com/api/v5/repos/{owner}/{repo}/contents/{path}
function createFile(path) {
	mui.ajax(api + owner + '/' + repo + '/contents/' + path, {
		beforeSend: function(xhr) {
			// xhr.setRequestHeader("Authorization:'token a3e5298bd2b3693e967b63636e6526f0ae47044d'");
		},
		data: {
			access_token: access_token,
			message: "00",
			content: $.base64.btoa("{}", true)
		},
		async: false,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			console.log(data)
		},
		error: function(xhr, type, errorThrown) {
			console.log(xhr)
		}
	});

}
			

//获取 文件内容
//入参 路径
var fileContents = null;
var fileSha = '';

function getFileContents(path) {
	mui.ajax(api + owner + '/' + repo + '/contents/' + path + '?access_token=' +
		access_token, {
			beforeSend: function(xhr) {
				// xhr.setRequestHeader("Authorization:'token a3e5298bd2b3693e967b63636e6526f0ae47044d'");
			},
			data: {},
			async: false,
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				$.base64.utf8encode = true;
				console.log(data)
				fileSha = data.sha;
				fileContents = $.base64.atob(data.content, true);
			},
			error: function(xhr, type, errorThrown) {
				console.log(xhr)
			}
		});
}

var content = {};
function saveFile(path, item) {
	content = {};
	var arr = [];
	getFileContents(path);
	if (fileContents == "{}") { //第一次
		var obj = {};
		arr.push(item)
		content.items = arr;
		putContent(path)

	} else {
		var db_ = eval('(' + fileContents + ')');
		arr = db_.items;
		arr.push(item)
		content.items = arr;
		putContent(path)

	}

}
			
//put 内容
function putContent(path) {
	mui.ajax('https://gitee.com/api/v5/repos/' + owner + '/' + repo + '/contents/' + path, {
		beforeSend: function(xhr) {
			// xhr.setRequestHeader("Authorization:'token a3e5298bd2b3693e967b63636e6526f0ae47044d'");
		},
		data: {
			access_token: access_token,
			message: new Date(),
			sha: fileSha,
			content: $.base64.btoa(JSON.stringify(content), true)
		},
		async: false,
		dataType: 'json', //服务器返回json格式数据
		type: 'put', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			console.log(data)
		},
		error: function(xhr, type, errorThrown) {
			console.log(xhr)
		}
	});

}
						

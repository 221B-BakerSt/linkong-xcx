<script>
export default {
	onLaunch: function () {
		console.log('App Launch')
		// this.$socket.connect({ url: "ws://127.0.0.1:8080/websocket" }).then(res => {
		// 	console.log("success");
		// 	this.$socket.onMessage(res => {
		// 		console.log("onmessage",res);
		// 	})
		// 	this.$socket.on("on").then(res=>{
		// 		console.log("on",res);
		// 	})
		// 	this.$socket.send({msg:"xxx"},true).then(res=>{
		// 		console.log("callback-uuid",res);
		// 	})
		// 	this.$socket.send({event:"on"})
		// })
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style lang="scss">
@import "uview-plus/index.scss";
@import '@/static/scss/index.scss';

/* 全局样式，防止滚动条显示 */
page {
  background-color: #f5f6f7;

  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
}

/* 隐藏所有滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

</style>
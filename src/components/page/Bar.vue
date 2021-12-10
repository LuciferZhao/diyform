<template>
  <div id="main">
    <div
      v-for="(item, index) in dataList"
      :key="index"
      :id="'id_' + item.id"
      style="width: 700px; height: 200px; float: left; margin: 1% 1.8% 1% 2.5%"
    ></div>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";

export default {
  name: "Bar",
  data() {
    return {
      dataList: [],
    };
  },
  methods: {
    getData() {
      axios
        .get(
          "http://127.0.0.1:8084/tybar/qstanswer/showData/" +
            this.$route.params.paperId,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          this.dataList = res.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      setTimeout(() => {
        this.showBar(this.dataList);
      }, 1000);
    },
    showBar(dataList) {
      console.log(dataList);
      for (var obj in dataList) {
        var id = "id_" + dataList[obj].id;
        console.log();
        var myChart = echarts.init(document.getElementById(id));
        // 指定图表的配置项和数据
        var option = {
          // 标题
          title: {
            text: dataList[obj].title,
          },
          // 配置提示信息
          tooltip: {},
          // 图例组件
          legend: {
            // data: ["销量"],
            // data: [{
            //         name: '销量',
            //         // 强制设置图形为圆。
            //         icon: 'circle',
            //         // 设置文本为红色
            //         textStyle: {
            //             color: 'blue'
            //         }
            //     }]
          },
          xAxis: {},
          yAxis: {
            data: dataList[obj].options,
          },
          series: [
            {
              type: "bar",
              data: dataList[obj].answerNumbers,
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped>
#main {
  width: 100%;
  height: 100%;
  float: left;
  overflow: auto;
}
</style>
import AbstractSmartComponent from './abstract-smart-component.js';
import {EVENTS} from '../utils/common.js';

import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const StatsChart = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPENT: `time-spent`
};

const createStatsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const renderChart = (ctx, data, barName) => {
  let types = [];
  let values = [];
  let sortedData = [];

  switch (barName) {
    case `money`:
      sortedData = data.sort((a, b) => (b.totalPrice - a.totalPrice));
      types = sortedData.map((item) => item.type.toUpperCase());
      values = sortedData.map((item) => item.totalPrice);
      break;
    case `transport`:
      sortedData = data.filter((item) => item.isTransport).sort((a, b) => (b.count - a.count));
      types = sortedData.map((item) => item.type.toUpperCase());
      values = sortedData.map((item) => item.count);
      break;
    case `time-spent`:
      sortedData = data.sort((a, b) => (b.totalTime - a.totalTime));
      types = sortedData.map((item) => item.type.toUpperCase());
      values = sortedData.map((item) => item.totalTime);
      break;
  }

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [
        {
          data: values,
          backgroundColor: `#ffffff`,
          minBarLength: 8,
          barThickness: 50,
          categoryPercentage: 1,
        }
      ],
    },
    options: {
      hover: false,
      layout: {
        padding: {
          left: 20,
          right: 50,
          top: 20,
          bottom: 20
        }
      },
      tooltips: {
        enabled: false
      },
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          anchor: `end`,
          align: `left`,
          font: {
            size: 12
          },
          color: `#000000`,
          formatter: (value) => {
            let formattedValue = ``;
            switch (barName) {
              case `money`:
                formattedValue = value ? `€ ${value}` : ``;
                break;
              case `transport`:
                formattedValue = value ? `${value}x` : ``;
                break;
              case `time-spent`:
                formattedValue = value ? `${value}H` : ``;
                break;
            }
            return formattedValue;
          }
        }
      },
      legend: {
        display: false
      },
      title: {
        display: true,
        text: barName.toUpperCase(),
        position: `left`,
        fontSize: 20,
        fontStyle: `bold`,
      },
      scales: {
        xAxes: [{
          ticks: {
            min: 0,
            padding: 0,
          },
          display: false,
        }],
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            fontSize: 14
          }
        }]
      }
    }
  });
};

const getFilteredCardsForStats = (cards) => {
  const filteredCards = [];
  const cardTypes = new Set(cards.map((card) => card.type));

  cardTypes.forEach((cardType) => {
    const filteredCardsByType = cards.filter((card) => card.type === cardType);

    filteredCards.push({
      type: cardType,
      totalPrice: filteredCardsByType.reduce((totalPrice, item) => totalPrice + item.price, 0),
      count: filteredCardsByType.length,
      totalTime: filteredCardsByType.reduce((totalTime, item) => totalTime + moment(item.endDate).diff(moment(item.startDate), `hours`), 0),
      isTransport: EVENTS.TRANSFER.some((item) => cardType === item)
    });
  });

  return filteredCards;
};

export default class Stats extends AbstractSmartComponent {
  constructor(cards) {
    super();
    this._cards = cards;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  recoveryListeners() {}

  rerender(cards) {
    this._cards = cards;
    super.rerender();
    this._renderCharts();
  }

  show() {
    super.show();
    this.rerender(this._cards);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }

  _renderCharts() {
    const element = this.getElement();

    const filteredCardsForStats = getFilteredCardsForStats(this._cards.getCardsAll());

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderChart(moneyCtx, filteredCardsForStats, StatsChart.MONEY);
    this._transportChart = renderChart(transportCtx, filteredCardsForStats, StatsChart.TRANSPORT);
    this._timeChart = renderChart(timeCtx, filteredCardsForStats, StatsChart.TIME_SPENT);
  }
}

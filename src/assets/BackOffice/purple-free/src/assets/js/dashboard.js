(function ($) {
  'use strict';

  // Chart 1
  if ($("#visit-sale-chart").length) {
    const ctx = document.getElementById('visit-sale-chart');

    const graphContext = ctx.getContext("2d");

    const gradientStrokeViolet = graphContext.createLinearGradient(0, 0, 0, 181);
    gradientStrokeViolet.addColorStop(0, 'rgba(218, 140, 255, 1)');
    gradientStrokeViolet.addColorStop(1, 'rgba(154, 85, 255, 1)');

    const gradientStrokeBlue = graphContext.createLinearGradient(0, 0, 0, 360);
    gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
    gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');

    const gradientStrokeRed = graphContext.createLinearGradient(0, 0, 0, 300);
    gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
    gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');

    const bgColor1 = "rgba(218, 140, 255, 1)";
    const bgColor2 = "rgba(54, 215, 232, 1)";
    const bgColor3 = "rgba(255, 191, 150, 1)";

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'],
        datasets: [
          {
            label: "CHN",
            borderColor: gradientStrokeViolet,
            backgroundColor: gradientStrokeViolet,
            fillColor: bgColor1,
            hoverBackgroundColor: gradientStrokeViolet,
            pointRadius: 0,
            borderWidth: 1,
            fill: 'origin',
            data: [20, 40, 15, 35, 25, 50, 30, 20],
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          },
          {
            label: "USA",
            borderColor: gradientStrokeRed,
            backgroundColor: gradientStrokeRed,
            fillColor: bgColor2,
            hoverBackgroundColor: gradientStrokeRed,
            pointRadius: 0,
            borderWidth: 1,
            fill: 'origin',
            data: [40, 30, 20, 10, 50, 15, 35, 40],
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          },
          {
            label: "UK",
            borderColor: gradientStrokeBlue,
            backgroundColor: gradientStrokeBlue,
            fillColor: bgColor3,
            hoverBackgroundColor: gradientStrokeBlue,
            pointRadius: 0,
            borderWidth: 1,
            fill: 'origin',
            data: [70, 10, 30, 40, 25, 50, 15, 30],
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        elements: {
          line: {
            tension: 0.4,
          },
        },
        scales: {
          y: {
            display: false,
            grid: {
              drawOnChartArea: true,
              drawTicks: false,
            },
          },
          x: {
            display: true,
            grid: {
              display: false,
            },
          }
        },
        plugins: {
          legend: { display: false }
        }
      },
      plugins: [{
        afterDatasetUpdate: function (chart) {
          const chartId = chart.canvas.id;
          const legendId = `${chartId}-legend`;
          const legendElement = document.getElementById(legendId);

          if (legendElement) {
            const ul = document.createElement('ul');
            chart.data.datasets.forEach((dataset) => {
              ul.innerHTML += `
                <li>
                  <span style="background-color: ${dataset.fillColor}"></span>
                  ${dataset.label}
                </li>
              `;
            });
            legendElement.appendChild(ul);
          }
        }
      }]
    });
  }

  // Chart 2
  if ($("#traffic-chart").length) {
    const ctx = document.getElementById('traffic-chart');
    const graphContext = ctx.getContext("2d");

    const gradientStrokeBlue = graphContext.createLinearGradient(0, 0, 0, 181);
    gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
    gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');

    const gradientStrokeRed = graphContext.createLinearGradient(0, 0, 0, 50);
    gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
    gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');

    const gradientStrokeGreen = graphContext.createLinearGradient(0, 0, 0, 300);
    gradientStrokeGreen.addColorStop(0, 'rgba(6, 185, 157, 1)');
    gradientStrokeGreen.addColorStop(1, 'rgba(132, 217, 210, 1)');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Search Engines 30%', 'Direct Click 30%', 'Bookmarks Click 40%'],
        datasets: [{
          data: [30, 30, 40],
          backgroundColor: [gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed],
          hoverBackgroundColor: [gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed],
          borderColor: [gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed],
          legendColor: [gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed]
        }]
      },
      options: {
        cutout: 50,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        }
      },
      plugins: [{
        afterDatasetUpdate: function (chart) {
          const chartId = chart.canvas.id;
          const legendId = `${chartId}-legend`;
          const legendElement = document.getElementById(legendId);

          if (legendElement) {
            const ul = document.createElement('ul');
            chart.data.datasets[0].data.forEach((_, i) => {
              ul.innerHTML += `
                <li>
                  <span style="background-color: ${chart.data.datasets[0].legendColor[i]}"></span>
                  ${chart.data.labels[i]}
                </li>
              `;
            });
            legendElement.appendChild(ul);
          }
        }
      }]
    });
  }

  // Datepicker
  if ($("#inline-datepicker").length) {
    $('#inline-datepicker').datepicker({
      enableOnReadonly: true,
      todayHighlight: true,
    });
  }

  // Bannière promotionnelle
  const proBanner = document.querySelector('#proBanner');
  const navbar = document.querySelector('.navbar');
  const pageBody = document.querySelector('.page-body-wrapper');

  if ($.cookie('purple-pro-banner') !== "true") {
    if (proBanner && navbar) {
      proBanner.classList.add('d-flex');
      navbar.classList.remove('fixed-top');
    }
  } else {
    if (proBanner && navbar) {
      proBanner.classList.add('d-none');
      navbar.classList.add('fixed-top');
    }
  }

  if (navbar && pageBody) {
    if (navbar.classList.contains("fixed-top")) {
      pageBody.classList.remove('pt-0');
      navbar.classList.remove('pt-5');
    } else {
      pageBody.classList.add('pt-0');
      navbar.classList.add('pt-5');
      navbar.classList.add('mt-3');
    }
  }

  const bannerClose = document.querySelector('#bannerClose');
  if (bannerClose) {
    bannerClose.addEventListener('click', function () {
      if (proBanner && navbar && pageBody) {
        proBanner.classList.add('d-none');
        proBanner.classList.remove('d-flex');
        navbar.classList.remove('pt-5');
        navbar.classList.add('fixed-top');
        pageBody.classList.add('proBanner-padding-top');
        navbar.classList.remove('mt-3');
      }

      const date = new Date();
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000); // expire in 1 day
      $.cookie('purple-pro-banner', "true", { expires: date });
    });
  }

})(jQuery);

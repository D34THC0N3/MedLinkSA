/* ============================================
   MedLink SA — Chart Rendering
   ============================================ */

class ChartManager {
  constructor() {
    this.charts = {};
    
    // Load Chart.js dynamically if not present
    if (typeof Chart === 'undefined') {
      this.loadChartJS().then(() => this.init());
    } else {
      this.init();
    }
  }

  async loadChartJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  init() {
    // Set global defaults for Chart.js to match our design system
    Chart.defaults.color = 'rgba(148, 163, 184, 0.8)'; // var(--text-secondary)
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    // Listen for theme changes to update chart colors
    document.addEventListener('themeChanged', (e) => {
      this.updateThemeColors(e.detail.theme);
    });
    
    // Automatically initialize any charts on the page
    this.autoInitCharts();
  }

  getThemeColors(theme) {
    if (theme === 'light') {
      return {
        grid: 'rgba(0, 0, 0, 0.05)',
        text: '#64748B',
        primary: '#2563EB',
        primaryLight: 'rgba(37, 99, 235, 0.2)',
        accent: '#06B6D4'
      };
    } else {
      return {
        grid: 'rgba(255, 255, 255, 0.05)',
        text: '#94A3B8',
        primary: '#0EA5E9',
        primaryLight: 'rgba(14, 165, 233, 0.2)',
        accent: '#10B981'
      };
    }
  }

  updateThemeColors(theme) {
    const colors = this.getThemeColors(theme);
    Chart.defaults.color = colors.text;
    
    Object.values(this.charts).forEach(chart => {
      if (chart.options.scales) {
        if (chart.options.scales.x) {
          chart.options.scales.x.grid.color = colors.grid;
        }
        if (chart.options.scales.y) {
          chart.options.scales.y.grid.color = colors.grid;
        }
      }
      chart.update();
    });
  }

  autoInitCharts() {
    // Health Metrics Chart (Patient)
    const metricsCanvas = document.getElementById('health-metrics-chart');
    if (metricsCanvas) {
      this.createHealthMetricsChart(metricsCanvas);
    }

    // Appointment Volume Chart (Hospital/Admin)
    const volumeCanvas = document.getElementById('appointment-volume-chart');
    if (volumeCanvas) {
      this.createVolumeChart(volumeCanvas);
    }

    // Adherence Donut Chart (Patient)
    const adherenceCanvas = document.getElementById('adherence-chart');
    if (adherenceCanvas) {
      this.createAdherenceChart(adherenceCanvas);
    }
  }

  createHealthMetricsChart(canvas) {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const colors = this.getThemeColors(theme);
    
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, colors.primaryLight);
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');

    this.charts['metrics'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Systolic BP',
          data: [140, 138, 135, 132, 130, 128],
          borderColor: colors.primary,
          backgroundColor: gradient,
          borderWidth: 2,
          pointBackgroundColor: colors.primary,
          pointBorderColor: '#fff',
          pointRadius: 4,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Diastolic BP',
          data: [90, 88, 85, 82, 80, 78],
          borderColor: colors.accent,
          borderWidth: 2,
          pointBackgroundColor: colors.accent,
          pointBorderColor: '#fff',
          pointRadius: 4,
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 10,
            displayColors: true
          }
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false }
          },
          y: {
            grid: { color: colors.grid, drawBorder: false },
            suggestedMin: 60,
            suggestedMax: 160
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  }

  createVolumeChart(canvas) {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const colors = this.getThemeColors(theme);
    
    const ctx = canvas.getContext('2d');
    
    this.charts['volume'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Appointments',
          data: [65, 85, 73, 90, 110, 45, 20],
          backgroundColor: colors.primary,
          borderRadius: 4,
          barThickness: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: colors.grid } }
        }
      }
    });
  }

  createAdherenceChart(canvas) {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const colors = this.getThemeColors(theme);
    
    const ctx = canvas.getContext('2d');
    
    this.charts['adherence'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Taken', 'Missed'],
        datasets: [{
          data: [95, 5],
          backgroundColor: [
            colors.accent,
            'rgba(239, 68, 68, 0.8)' // Danger
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      },
      plugins: [{
        id: 'textCenter',
        beforeDraw: function(chart) {
          var width = chart.width,
              height = chart.height,
              ctx = chart.ctx;

          ctx.restore();
          var fontSize = (height / 114).toFixed(2);
          ctx.font = "bold " + fontSize + "em 'Outfit', sans-serif";
          ctx.textBaseline = "middle";
          ctx.fillStyle = colors.text;

          var text = "95%",
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }]
    });
  }
}

window.charts = new ChartManager();

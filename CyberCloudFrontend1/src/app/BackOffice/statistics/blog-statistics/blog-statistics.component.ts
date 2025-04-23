import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatisticsService } from '../../../services/statistics.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

Chart.register(...registerables);

type TimeRange = 'daily' | 'monthly' | 'yearly';

@Component({
  selector: 'app-blog-statistics',
  templateUrl: './blog-statistics.component.html',
  styleUrls: ['./blog-statistics.component.css']
})
export class BlogStatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('postsChart') postsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('commentsChart') commentsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reactionsChart') reactionsChartRef!: ElementRef<HTMLCanvasElement>;

  currentView: TimeRange = 'monthly';
  currentViewLabel: string = '(par mois)';

  postsData: Map<string, number> = new Map();
  commentsData: Map<string, number> = new Map();
  reactionsData: Map<string, number> = new Map();

  postsChart: any;
  commentsChart: any;
  reactionsChart: any;

  isLoading = true;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // On attend que les références aux éléments canvas soient disponibles
    setTimeout(() => {
      // Si les données sont déjà chargées, créer les graphiques
      if (!this.isLoading) {
        this.createCharts();
      }
    }, 100);
  }

  switchView(view: TimeRange): void {
    this.currentView = view;
    this.currentViewLabel =
      view === 'daily' ? '(par jour)' : view === 'monthly' ? '(par mois)' : '(par an)';
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // Utilisation de forkJoin pour charger toutes les données en parallèle
    forkJoin([
      this.loadPostsData(),
      this.loadCommentsData(),
      this.loadReactionsData()
    ]).subscribe({
      complete: () => {
        this.isLoading = false;
        // Vérifier si la vue est initialisée avant de créer les graphiques
        if (this.postsChartRef && this.commentsChartRef && this.reactionsChartRef) {
          setTimeout(() => {
            this.createCharts();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
        // Vous pouvez ajouter ici un message d'erreur à l'utilisateur
      }
    });
  }

  loadPostsData() {
    let observable;
    switch (this.currentView) {
      case 'daily':
        observable = this.statisticsService.getPostsCountByDay();
        break;
      case 'monthly':
        observable = this.statisticsService.getPostsCountByMonth();
        break;
      case 'yearly':
        observable = this.statisticsService.getPostsCountByYear();
        break;
    }

    return observable.pipe(
      tap((data) => {
        // Convertir l'objet en Map
        this.postsData = new Map(Object.entries(data));
      })
    );
  }

  loadCommentsData() {
    let observable;
    switch (this.currentView) {
      case 'daily':
        observable = this.statisticsService.getCommentsCountByDay();
        break;
      case 'monthly':
        observable = this.statisticsService.getCommentsCountByMonth();
        break;
      case 'yearly':
        observable = this.statisticsService.getCommentsCountByYear();
        break;
    }

    return observable.pipe(
      tap((data) => {
        // Convertir l'objet en Map
        this.commentsData = new Map(Object.entries(data));
      })
    );
  }

  loadReactionsData() {
    // Les réactions n'ont pas de vue temporelle, donc nous utilisons toujours la même méthode
    return this.statisticsService.getReactionsDistribution().pipe(
      tap((data) => {
        // Convertir l'objet en Map
        this.reactionsData = new Map(Object.entries(data));
      })
    );
  }

  createCharts(): void {
    // Détruire les anciens graphiques s'ils existent
    if (this.postsChart) this.postsChart.destroy();
    if (this.commentsChart) this.commentsChart.destroy();
    if (this.reactionsChart) this.reactionsChart.destroy();

    // Créer les nouveaux graphiques
    this.createPostsChart();
    this.createCommentsChart();
    this.createReactionsChart();
  }

  createPostsChart(): void {
    const postsCtx = this.postsChartRef.nativeElement.getContext('2d');
    if (!postsCtx) return;

    const labels = Array.from(this.postsData.keys()).map(key => {
      if (this.currentView === 'monthly') {
        const [year, month] = key.split('-');
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return monthNames[parseInt(month) - 1];
      }
      return key;
    });

    this.postsChart = new Chart(postsCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Articles',
          data: Array.from(this.postsData.values()),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { 
              precision: 0,
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value;
                }
                return '';
              }
            } 
          }
        }
      }
    });
  }

  createCommentsChart(): void {
    const commentsCtx = this.commentsChartRef.nativeElement.getContext('2d');
    if (!commentsCtx) return;

    const labels = Array.from(this.commentsData.keys()).map(key => {
      if (this.currentView === 'monthly') {
        const [year, month] = key.split('-');
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return monthNames[parseInt(month) - 1];
      }
      return key;
    });

    this.commentsChart = new Chart(commentsCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Commentaires',
          data: Array.from(this.commentsData.values()),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { 
              precision: 0,
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value;
                }
                return '';
              }
            } 
          }
        }
      }
    });
  }

  createReactionsChart(): void {
    const reactionsCtx = this.reactionsChartRef.nativeElement.getContext('2d');
    if (!reactionsCtx) return;

    // Trier les réactions par nombre décroissant
    const sortedReactions = Array.from(this.reactionsData.entries())
      .sort((a, b) => b[1] - a[1]);

    this.reactionsChart = new Chart(reactionsCtx, {
      type: 'pie',
      data: {
        labels: sortedReactions.map(([label]) => label),
        datasets: [{
          data: sortedReactions.map(([_, count]) => count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverBorderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        cutout: '50%', // Définit la taille du trou au centre (pour un cercle bien défini)
        layout: {
          padding: 20
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => Number(a) + Number(b), 0);
                const percentage = ((Number(value) / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
              // Ajouter un titre au tooltip avec le pourcentage
              title: function(tooltipItems) {
                const item = tooltipItems[0];
                const value = item.raw || 0;
                const total = item.dataset.data.reduce((a, b) => Number(a) + Number(b), 0);
                const percentage = ((Number(value) / total) * 100).toFixed(1);
                return `${percentage}%`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  }
}
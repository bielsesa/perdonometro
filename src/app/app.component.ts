import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public monedas = [
    { tipo: '50 cts', cantidad: 0, valor: 0.5 },
    { tipo: '20 cts', cantidad: 0, valor: 0.2 },
  ];

  public total = 0;

  constructor(public storageService: StorageService) {}

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    // await this.storage.create();
    this.monedas = (await this.storageService.getObject('monedas')) ?? [
      { tipo: '50 cts', cantidad: 0, valor: 0.5 },
      { tipo: '20 cts', cantidad: 0, valor: 0.2 },
    ];
    // this.monedas = await this.storageService.getObject('total') ?? 0;
    this.calculateTotal();
  }

  onAddMonedita(event, tipoMoneda) {
    // check which type has changed
    this.monedas.forEach((moneda) => {
      if (moneda.tipo === tipoMoneda) {
        // add one to its value
        moneda.cantidad++;

        // update total
        this.total += moneda.valor;

        this.storageService.setObject('monedas', this.monedas);
      }
    });
  }

  onSubtractMonedita(event, tipoMoneda) {
    // check which type has changed
    this.monedas.forEach((moneda) => {
      if (moneda.tipo === tipoMoneda && moneda.cantidad > 0) {
        // subtract one to its value
        moneda.cantidad--;

        // update total
        this.total -= moneda.valor;

        this.storageService.setObject('monedas', this.monedas);
      }
    });
  }

  onCantidadChanged(event, tipoMoneda) {
    // console.log(`Event:`);
    // console.log(event.detail.value);
    // console.log(`Tipo moneda: ${tipoMoneda}`);

    this.monedas.forEach((moneda) => {
      if (moneda.tipo === tipoMoneda) {
        // add one to its value
        moneda.cantidad = event.detail.value;
      }
    });

    this.calculateTotal();

    this.storageService.setObject('monedas', this.monedas);
  }

  calculateTotal() {
    this.total = this.monedas.reduce(
      (sum, current) => sum + current.cantidad * current.valor,
      0
    );
  }
}

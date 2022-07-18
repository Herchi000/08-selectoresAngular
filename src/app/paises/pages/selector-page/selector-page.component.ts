import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];


  //UI
  cargando: boolean = false;


  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // this.miFormulario.get('region')?.valueChanges 
    //     .subscribe( region => {
    //       console.log(region);
          
    //       this.paisesService.getPaisesPorRegion(region)
    //         .subscribe(paises => {
    //           console.log(paises);
              
    //           this.paises = paises;
    //         })
    //     })


    //Cuando cambia la Region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
          
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        
        this.paises = paises;
        this.cargando = false;
        
      });


      //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;

        }),
        switchMap(codigo => this.paisesService.getPaisPorCode(codigo))
      )
      .subscribe(pais => {
        
        this.fronteras = pais![0].borders || [];
        this.cargando = false;

        

      }
        
        
      )

  }


  guardar(){
    console.log(this.miFormulario.value);
    
  }
}

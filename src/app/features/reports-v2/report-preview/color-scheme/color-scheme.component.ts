import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Logger} from "../../../../shared/services";
import { ColorScheme } from 'src/app/shared/data/reports/color-scheme';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ColorSchemeService } from '../../services/color-scheme.service';
import { take } from 'rxjs';

const log = new Logger(`ColorSchemeComponent`);

@Component({
  selector: 'app-color-scheme',
  templateUrl: './color-scheme.component.html',
  styleUrls: ['./color-scheme.component.css']
})
export class ColorSchemeComponent implements OnInit{

  @Output() selectedColorScheme: EventEmitter<any> = new EventEmitter<any>();

  public colourSchemes: ColorScheme[] = [
    {
      id: null,
      name: "Scheme A", 
      colors: ['#4f1025', '#c5003e', '#d9ff5b', '#78aa00', '#15362d'], 
      selected: true
    },
  ];

  public newColorScheme: ColorScheme = {
    name: '',
    colors: ['','', '', '', '']
  }

  public numberOfColors: number = 5;
  public colorSchemeForm: FormGroup;
  // public colorInputs;
  public fields = [];
  public defaultColor: string = '#ffffff';
  public colorSchemeName: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private colorSchemeService: ColorSchemeService
  ) {
    
  }

  ngOnInit(): void {
    this.createColorSchemeForm();
    this.fetchAllColorSchemes();
  }

  createColorSchemeForm() {
    const formGroupFields = this.getFormControlFields();
    this.colorSchemeForm = new FormGroup(formGroupFields);
  }

  getFormControlFields() {
    this.fields = [];
    const colorInputs = {};

    for (let i = 0; i < this.newColorScheme.colors.length; i++) {
      const colorNumber = `color${i}`;
      colorInputs[colorNumber] = '';
    };

    const formGroupFields = {};
    for (const field of Object.keys(colorInputs)) {
      formGroupFields[field] = new FormControl('#ffffff');
      this.fields.push(field);
    }
    log.info(`fields >>>`, this.fields)
    
    return formGroupFields;
  }


  /**
   * Emits the selected colorScheme to the parent object
   * @param selectedScheme 
   */
  selectColorScheme(selectedScheme) {
    this.selectedColorScheme.emit(selectedScheme);
  }


  addColorBox() {
    this.newColorScheme.colors.push('');
    this.createColorSchemeForm();
  }

  defineColorSchemeName(e) {
    this.colorSchemeName = e.target.value;
    // log.info(`color scheme name >>> `, this.colorSchemeName);
  }

  saveColorScheme() {
    const formValueColors = this.colorSchemeForm.getRawValue();
    let colors = ``;

    for (const color of Object.keys(formValueColors)) {
      colors += `${formValueColors[color]},`
    };

    const newColorScheme = {
      name: this.colorSchemeName,
      colors
    };
    const name = this.colorSchemeName;
    this.colorSchemeService.createColorScheme(newColorScheme)
    .pipe(take(1))
    .subscribe(colorScheme => {
      log.info(`color scheme created `, colorScheme);
    })
  }

  fetchAllColorSchemes() {
    this.colorSchemeService.fetchAllColorSchemes()
    .pipe(take(1))
    .subscribe((colorSchemes) => {
      colorSchemes.forEach((colorScheme) => {
        const scheme = {
          id: colorScheme.id,
          name: colorScheme.name,
          colors: colorScheme.colors.split(',')
        }
        this.colourSchemes.push(scheme)
      });
      log.info(`all color schemes >>> `, colorSchemes);
    })
  }

  deleteColorScheme(id: number) {
    this.colorSchemeService.deleteColorScheme(id)
    .pipe(take(1))
    .subscribe(res => {
      log.info(`successful delete `, res)
    })
  }

}
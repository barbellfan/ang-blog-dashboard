import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private categoryService: CategoriesService) { }

  ngOnInit(): void {
    ;
  }

  onSubmit(formData: NgForm){
    let categoryData: Category = {
      category: formData.value.category
    }

    this.categoryService.saveData(categoryData);
  }
}

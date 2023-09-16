import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';
import { FsCategory } from '../models/fs-category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoryArray: Array<FsCategory>;
  formCategory!: string;
  formStatus: string = 'Add';
  categoryId: string = '';

  constructor(private categoryService: CategoriesService) {
    this.categoryArray = [];
  }

  ngOnInit(): void {
    let thisthis = this;
    this.categoryService.loadData().then(
      function(val: FsCategory[]) {
        thisthis.categoryArray = val;
      },
      function(error) {
        console.log("data not loaded: " + error);
      }
    );
  }

  onSubmit(formData: NgForm){
    let categoryData: Category = {
      category: formData.value.category
    }

    if(this.formStatus == 'Add') {
      this.categoryService.saveData(categoryData);
      formData.reset();
    }
    else if (this.formStatus == 'Edit') {
      this.categoryService.updateData(this.categoryId, categoryData);
      formData.reset();
      this.formStatus = 'Add';
    }
    this.ngOnInit();
  }

  onEdit(cat: string, id: string) {
    this.formCategory = cat;
    this.formStatus = 'Edit';
    this.categoryId = id;
  }

  onDelete(id: string) {
    this.categoryService.deleteData(id);
    this.ngOnInit();
  }
}

import { Component, OnInit } from '@angular/core';
import * as fs from '@angular/fire/firestore';

//import { AngularFireStore } from '@angular/fire/firestore'; in video, but does not work.

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private afs: fs.Firestore) { }

  ngOnInit(): void {
    ;
  }

  onSubmit(formData: NgForm){
    let categoryData = {
      category: formData.value.category
    }

    let subCategoryData = {
      subCategory: 'subCategory'
    }

    fs.addDoc(fs.collection(this.afs, 'categories'), categoryData)
    .then((documentReference: fs.DocumentReference) => {
      console.log("outer doc id: " + documentReference.id);

      // this actually works.
      fs.addDoc(fs.collection(this.afs,`categories/${documentReference.id}/subcategories/`), subCategoryData).then((docref: fs.DocumentReference) => {
        console.log("inner doc id: " + docref.id);
      })
      .catch(error => {
        console.log("inner error: " + error);
      });
    })
    .catch(error => {
      console.log("outer error: " + error);
    });
  }
}

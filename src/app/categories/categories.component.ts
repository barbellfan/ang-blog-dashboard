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
      console.log(documentReference);

      // this doesn't work. video is out of date, and I can't figure out how to do this
      // with the current api.
      /*
      fs.collection(this.afs, 'categories').doc(documentReference.id).collection('subcategories').add(subCategoryData).then(docref1 => {
        console.log(docref1);
        there's another nested collection call here, but I'm not typing it in.
      });
      */
    })
    .catch(error => {
      console.log("error: " + error);
    });
  }
}

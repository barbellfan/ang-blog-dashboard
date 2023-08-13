import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, DocumentReference } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    ;
  }

  onSubmit(formData: NgForm){
    let categoryData = {
      category: formData.value.category
    }

    addDoc(collection(this.firestore, 'categories'), categoryData)
    .then((documentReference: DocumentReference) => {
      console.log(documentReference);
    })
    .catch(error => {
      console.log("error: " + error);
    });
  }
}

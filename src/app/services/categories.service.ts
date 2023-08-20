import { Injectable } from '@angular/core';
import * as fs from '@angular/fire/firestore';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: fs.Firestore) { }

  saveData(data: Category) {

    fs.addDoc(fs.collection(this.afs, 'categories'), data)
    .then((documentReference: fs.DocumentReference) => {
      console.log("saved doc id: " + documentReference.id);
    })
    .catch(error => {
      console.log("error in saveDate() calling fs.addDoc(): " + error);
    });
  }
}

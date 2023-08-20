import { Injectable } from '@angular/core';
import * as fs from '@angular/fire/firestore';
import { Category } from '../models/category';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: fs.Firestore, private toastr: ToastrService) { }

  saveData(data: Category) {

    fs.addDoc(fs.collection(this.afs, 'categories'), data)
    .then((documentReference: fs.DocumentReference) => {
      console.log("saved doc id: " + documentReference.id);
      this.toastr.success('Data inserted successfully.');
    })
    .catch(error => {
      console.log("error in saveDate() calling fs.addDoc(): " + error);
    });
  }
}

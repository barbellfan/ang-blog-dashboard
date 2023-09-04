import { Injectable } from '@angular/core';
import * as fs from '@angular/fire/firestore';
import { Category } from '../models/category';
import { ToastrService } from 'ngx-toastr';
//import { map } from 'rxjs/operators';

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
      this.toastr.error("Error saving data: " + error);
    });
  }

  async loadData() {
    /* code from video
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data};
        })
      })
    );
    */

    const arr: any = []
    // taken from here: https://firebase.google.com/docs/firestore/query-data/get-data
    // Section titled: Get all documents in a subcollection
    const querySnapshot: fs.QuerySnapshot<fs.DocumentData> = await fs.getDocs(fs.collection(this.afs, 'categories'));
    console.log("num of documents: " + querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      let id: string = doc.id;
      let data: any = doc.data();
      arr.push({ id, data});
    });

    return arr;

  }
}

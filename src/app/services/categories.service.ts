import { Injectable } from '@angular/core';
import * as fs from '@angular/fire/firestore';
import { Category } from '../models/category';
import { FsCategory } from '../models/fs-category';
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

  async loadData(): Promise<FsCategory[]> {
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

    const arr: FsCategory[] = []
    // taken from here: https://firebase.google.com/docs/firestore/query-data/get-data
    // Section titled: Get all documents in a subcollection
    const querySnapshot: fs.QuerySnapshot<fs.DocumentData> = await fs.getDocs(fs.collection(this.afs, 'categories'));
    querySnapshot.forEach((doc) => {
        const fsCat: FsCategory = {
          id: doc.id,
          category: doc.data()['category'] // use the indexer!!
      };
      arr.push(fsCat);
    });

    return arr;
  }

  updateData(id: string, editedData: Category) {
    /* code from video
    this.afs.collection('categories').doc(id).update(editedData).then(docRef => {
      this.toastr.success('Data Updated Successfully');
    });
    */
    const db = fs.collection(this.afs, 'categories');
    const docRef = fs.doc(db, id);
    const data = { category: editedData.category }
    fs.updateDoc(
      docRef,
      data
    ).then(docReff => {
      this.toastr.success('Data Updated Successfully');
      //console.log("document updated");
    })
    .catch(error => {
      this.toastr.error("Error updating data: " + error);
      console.log(error);
    });
  }

  deleteData(id: string) {
    /* code from video
    this.afs.collection('categories').doc(id).delete().then(docRef => {
      this.toastr.success('Data Deleted Successfully');
    });
    */
    const db = fs.collection(this.afs, 'categories');
    const docRef = fs.doc(db, id);
    fs.deleteDoc(docRef).then(docRef => {
      this.toastr.success('Data Deleted Successfully');
    })
    .catch(error => {
      this.toastr.error("Error deleting data: " + error)
    });
  }
}

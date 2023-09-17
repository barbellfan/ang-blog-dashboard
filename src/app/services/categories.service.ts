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
    const db = fs.collection(this.afs, 'categories')
    fs.addDoc(db, data)
    .then((documentReference: fs.DocumentReference) => {
      this.toastr.success('Data inserted successfully. ID: ' + documentReference.id);
    })
    .catch(error => {
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
    const db = fs.collection(this.afs, 'categories');
    const querySnapshot: fs.QuerySnapshot<fs.DocumentData> = await fs.getDocs(db);
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
    ).then(() => {
      this.toastr.success('Data updated successfully. ');
    })
    .catch(error => {
      this.toastr.error("Error updating data: " + error);
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
    fs.deleteDoc(docRef).then(() => {
      this.toastr.success('Data deleted successfully');
    })
    .catch(error => {
      this.toastr.error("Error deleting data: " + error)
    });
  }
}

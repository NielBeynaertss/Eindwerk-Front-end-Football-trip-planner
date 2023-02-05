import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  url: string = 'http://127.0.0.1:8000/api';

  constructor(private router: Router, private toastr: ToastrService) { }


  register(name: string, email: string, password: string) {

    console.log(JSON.stringify({
      name: name,
      email: email,
      password: password,
    }));
    fetch(this.url + '/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      })
    })
      .then(response => {
        console.log(response.status);
        if (response.status == 201) {
          this.toastr.success('yay', 'You have been registered');
          this.router.navigate(['/']);
        } else {
          this.toastr.warning('Whoops', 'Something went wrong');
        }
      })
  }


  getUsersFromApi(username: string, password: string) {
    console.log(username, password);
    fetch(this.url + '/users/' + username)
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(data => {
        if (!data[0]) throw new Error("User not found");
        console.log(data[0].password);
        bcrypt.compare(password, data[0].password, (err, res) => {
          if (res) {
            window.localStorage.setItem('username', username);
            window.localStorage.setItem('userId', data[0].id);
            if (data[0].profile) { window.localStorage.setItem('profile', data[0].profile) };
            this.router.navigate(['/secure']);
          } else {
            this.toastr.warning('Whoops', 'Something went wrong');
          }
        });
      })
      .catch(error => {
        if (error.message === "User not found") this.toastr.error('User not found', 'Unable to login');
        else this.toastr.error('Error', 'An error occured');
      });
  }



}
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Course } from 'src/app/Interfaces/Course';
import { WishListService } from 'src/app/services/wish-list.service';
import { ModalComponent } from '../modal/modal.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-wish-item',
  templateUrl: './wish-item.component.html',
  styleUrls: ['./wish-item.component.css'],
})
export class WishItemComponent {
  constructor(
    private wishListService: WishListService,
    public dialog: MatDialog,
    private cartService: CartService
  ) {}

  @Input() wishItem: Course = {
    courseName: '',
    author: '',
    actualPrice: '',
    discountPercentage: '',
    tags: [],
  };

  removeCourseFromWish(wishItem: Course) {
    this.wishListService.deleteFromWish(wishItem.courseName);
  }

  //show modal for user to confirm delete
  openDialog(cartItem: Course) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Delete Course',
        massage: 'Are you sure to delete this course?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.removeCourseFromWish(cartItem);
        console.log('true');
      } else {
        dialogRef.close();
        console.log('false');
      }
    });
  }

  // Logic to move Course From Wish To Cart
  moveCourseFromWishToCart(wishItem: Course) {
    //add course to cart
    this.cartService.addToCart(wishItem)
  
    console.log('isCourseExistInCart', this.cartService.isCourseExistInCart);

    if (this.cartService.isCourseExistInCart) {
      this.cartService.isCourseExistInCart = false;
      return;
    }
    //remove course from wish
    this.wishListService.deleteFromWish(wishItem.courseName);
  }
}

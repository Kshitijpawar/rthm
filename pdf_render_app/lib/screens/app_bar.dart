import 'package:flutter/material.dart';
import 'package:pdfx/src/viewer/pinch/pdf_view_pinch.dart';
// import 'package:go_router/go_router.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final PdfControllerPinch pdfControllerPinch;
  const CustomAppBar({super.key, required this.pdfControllerPinch});

  @override
  Size get preferredSize => const Size.fromHeight(60.0);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      actions: [
        // IconButton(
        //   onPressed: () {
        //     print("Question answer button pressed");
        //     GoRouter.of(context).pushNamed('chatpage',
        //                     );
        //   },
        //   icon: const Icon(Icons.question_answer),
        // ),
        IconButton(
          onPressed: () {
            // print("button pressed");
            pdfControllerPinch.animateToPage(pageNumber: 1);
          },
          icon: const Icon(Icons.arrow_upward),
        ),
        IconButton(
          onPressed: () {
            print("button pressed");
            pdfControllerPinch.animateToPage(pageNumber: 40, duration: Duration(seconds: 50,),curve: Curves.easeIn);
          },
          icon: const Icon(Icons.play_arrow),
        ),
        IconButton(
          icon: const Icon(
            Icons.info_outlined,
          ),
          onPressed: () {
            return showAboutDialog(
              context: context,
              applicationName: "Control Wiki",
              applicationVersion: "1.0.0",
              applicationLegalese:
                  "Copyrights Reserved. Data scraped from Fandom. All images are property of Remedy Entertainment, used for personal use only.",
              children: [
                const Padding(
                  padding: EdgeInsets.all(15.0),
                  child: Text("Made by Kshitij Pawar"),
                ),
              ],
            );
          },
        )
      ],
      title: const Text(
        'PDF render app',
        // style: TextStyle(
        //   fontFamily: 'ITCAvantGardeStd-Demi',
        //   fontWeight: FontWeight.w700,
        //   fontSize: 20.0,
        //   color: Color.fromARGB(255, 231, 0, 13),
        // ),
      ),
      // backgroundColor: const Color.fromARGB(255, 40, 40, 40),
    );
  }
}

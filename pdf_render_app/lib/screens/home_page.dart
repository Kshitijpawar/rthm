import 'package:flutter/material.dart';

import 'package:pdf_render_app/screens/app_bar.dart';
import 'package:pdfx/pdfx.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late PdfController _pdfController;
  late PdfControllerPinch _pdfControllerPinch;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    // _pdfController = PdfController(
    //   document: PdfDocument.openAsset("assets/pdf_files/test_file.pdf"),
    //   initialPage: 0,
    // );
    _pdfControllerPinch = PdfControllerPinch(
      document: PdfDocument.openAsset("assets/pdf_files/test_file2.pdf"),
      // initialPage: 0,
    );
  }

  @override
  void dispose() {
    // TODO: implement dispose
    _pdfController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar( pdfControllerPinch: _pdfControllerPinch,),
      body: PdfViewPinch(
        // controller: _pdfController,
        controller: _pdfControllerPinch,
      ),
    );
  }
}
